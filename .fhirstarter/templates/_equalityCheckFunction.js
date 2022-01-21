module.exports = `const fancyEqualityCheck = (objOne, objTwo) => {
	if (objOne instanceof Array && objTwo instanceof Array) {
		return handleArrays(objOne, objTwo);
	} else if (objOne instanceof Object && objTwo instanceof Object) {
		return handleObjects(objOne, objTwo);
	} else {
		return handleNumsAndStrings(objOne, objTwo);
	}
};

const handleObjects = (objectOne, objectTwo) => {
	// if the two objects have the same items, they don't need to be in the same
	// order to be considered equal here
	let keysOne = Object.keys(objectOne),
		keysTwo = Object.keys(objectTwo),
		// we don't want to include the underscored fields since they're for internal use and a fhir
		// resource wouldn't have them, therefore we ignore when checking equality in our tests
		// since one of the lists of keys will not have any underscored fields, we can assume that one
		// is the keys from the example object, and use that to check equality
		keysOneFiltered = keysOne.filter((k) => !k.startsWith('__')),
		keysTwoFiltered = keysTwo.filter((k) => !k.startsWith('__')),
		keysKey =
			keysOneFiltered.length === 0 ? keysOneFiltered : keysTwoFiltered;
	if (keysOneFiltered.length === keysTwoFiltered.length) {
		for (let key of keysKey) {
			if (
				(objectOne[key] instanceof Object &&
					objectTwo[key] instanceof Object) ||
				(objectOne[key] instanceof Array &&
					objectTwo[key] instanceof Array)
			) {
				if (!(keysOne.includes(key) && keysTwo.includes(key))) {
					// the key is missing from one of the objects, so we can just return false
					return false;
				}
				let eq = fancyEqualityCheck(objectOne[key], objectTwo[key]);
				if (eq) {
					continue;
				} else {
					return false;
				}
			} else {
				return objectOne[key] === objectTwo[key];
			}
		}
	} else {
		return false;
	}
	return true;
};

const handleArrays = (arrayOne, arrayTwo) => {
	// if the two arrays have the same items, they don't need to be in the same
	// order to be considered equal here
	let match = arrayOne.length === arrayTwo.length,
		okay = true;
	if (match) {
		for (let objA of arrayOne) {
			for (let objB of arrayTwo) {
				okay = fancyEqualityCheck(objA, objB);
				if (okay) {
					break;
				}
			}
			match &&= okay;
		}
	}
	return match;
};

const handleNumsAndStrings = (one, two) => {
	if (typeof one === typeof two) {
		return one === two;
	} else {
		return false;
	}
};
`
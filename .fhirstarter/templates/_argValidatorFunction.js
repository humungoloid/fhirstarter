module.exports = `const <__validateArgs> = (schema, args, argNames) => {
	let valid = true;
	for (let argName of argNames) {
		if (!valid) {
			break;
		}
		// just make everything into an array and use reducers
		let argValues = args[argName] instanceof Array ? [...args[argName]] : [args[argName]];
		// this could also be an array; in that case, use the first value, otherwise just use the value
		let valType = (schema[argName] instanceof Array ? schema[argName][0] : schema[argName]).replace(/_/g, '');
		// primitives are the base case in our recursion
		let primitive = primitives[valType];
		if (primitive) {
			// first make sure the value(s) are the correct type
			valid = argValues.reduce((a, b, idx, arr) => a && typeof b === primitive.type, valid);
			if (primitive.regex) {
				// then make sure they conform to the regex as specified in the fhir standard
				valid = argValues.reduce((a, b, idx, arr) => a && primitive.regex.test(b), valid);
			}
			if (primitive.validator) {
				// finally make sure they are valid, ie within a certain range or whatever
				valid = argValues.reduce((a, b, idx, arr) => a && primitive.validator(b), valid);
			}
		} else {
			// not a primitive value, need to call validateArgs on the type
			// recursion :)
			let newSchema = getSchema(valType);
			valid = argValues.reduce(
				(a, b, idx, arr) => a && <__validateArgs>(newSchema, b, Object.keys(newSchema)),
				newSchema !== null
			);
		}
	}

	return valid;
};`;

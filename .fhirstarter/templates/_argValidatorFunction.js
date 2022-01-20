// TODO: need to make the import modifyable
module.exports = `import * as datatypes from '../datatypes';

export const <__validateArgs> = (schema, args, argNames) => {
	let errors = new Array();

	for (let argName of argNames) {
		let valid = true;
		try {
			// just make everything into an array and use reducers
			let argValues =
				args[argName] instanceof Array
					? [...args[argName]]
					: [args[argName]];
			// this could also be an array; in that case, use the first value, otherwise just use the value
			let valType = (
				schema[argName] instanceof Array
					? schema[argName][0]
					: schema[argName]
			).replace(/_/g, '');
			// primitives are the base case in our recursion
			let primitive = datatypes.primitiveTypes[valType];
			if (primitive) {
				valid = validatePrimitive(primitive, argValues);
			} else {
				// not a primitive value, need to call <__validateArgs> on the type
				// recursion :)
				let newSchema = datatypes.getSchema(valType);
				valid = argValues.reduce(
					(a, b, idx, arr) =>
						a && <__validateArgs>(newSchema, b, Object.keys(newSchema)),
					newSchema !== undefined
				);
			}
		} catch (error) {
			errors.push({ name: argName, errorMsg: error.message });
		}
	}
	if (errors.length > 0) {
		console.warn(\`Invalid values discarded: \${errors.map(elem => elem.name).join(', ')}\`);
	}

	return errors.length < args.length;
};

export const validatePrimitive = (primitive, value) => {
	if (typeof primitive === 'string') {
		primitive = datatypes.primitiveTypes[primitive];
	}
	let valid = primitive !== undefined,
		valArray = value instanceof Array ? [...value] : [value];
	// first make sure the value(s) are the correct type
	valid = valArray.reduce(
		(a, b, idx, arr) => a && typeof b === primitive.type,
		valid
	);
	if (primitive.regex) {
		// then make sure they conform to the regex as specified in the fhir standard
		valid = valArray.reduce(
			(a, b, idx, arr) => a && primitive.regex.test(b),
			valid
		);
	}
	if (primitive.validator) {
		// finally make sure they are valid, ie within a certain range or whatever
		valid = valArray.reduce(
			(a, b, idx, arr) => a && primitive.validator(b),
			valid
		);
	}
	return valid;
};
`;

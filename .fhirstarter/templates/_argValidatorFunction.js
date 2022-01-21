// TODO: need to make the import modifyable
module.exports = `import { getSchema, isPrimitive, getPrimitive } from '../datatypes';

export const validateArgs = (schema, args, argNames) => {
	let errors = new Array();

	for (let argName of argNames) {
		let valid = true,
			present = true;
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
			if (argName === 'extension') {
				for (let extension of args[argName]) {
					let valueKey = Object.keys(extension).find(
							(elem) => elem !== 'url'
						),
						valueDataType =
							!!valueKey.includes('value') &&
							valueKey.slice('value'.length);
					valid =
						!!extension.url &&
						validatePrimitive(
							getPrimitive('url'),
							extension['url']
						) &&
						validateArgs(
							getSchema(valueDataType),
							extension[valueKey],
							Object.keys(extension[valueKey])
						);
				}
			} else {
				// primitives are the base case in our recursion
				let primitive = isPrimitive(valType);
				if (!!primitive) {
					valid = validatePrimitive(getPrimitive(valType), argValues);
				} else {
					// not a primitive value, need to call validateArgs on the type
					// recursion :)
					let newSchema = getSchema(valType);
					valid = argValues.reduce(
						(a, b, idx, arr) =>
							a &&
							validateArgs(newSchema, b, Object.keys(newSchema)),
						newSchema !== undefined
					);
				}
			}
			// make sure all values adhere to the rules
			if (schema['__rule']) {
				valid = schema['__rule'](args);
			}
		} catch (error) {
			if (!!args[argName]) {
				errors.push({ name: argName, errorMsg: error.message });
			}
		}
		if (!valid && !!args[argName]) {
			errors.push({ name: argName, errorMsg: 'Validation failed.' });
		}
	}
	if (errors.length > 0) {
		console.warn(
			\`Invalid values discarded: \${errors
				.map((elem) => elem.name)
				.join(', ')}\`
		);
	}

	return errors.length < argNames.length;
};

export const validatePrimitive = (primitive, value) => {
	if (typeof primitive === 'string') {
		primitive = getPrimitive(primitive);
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

const rules = require('./dataTypeRules');
const writeFile = require('../utils/fileWriter');
const CAN_EDIT = false;
module.exports = async (dataTypes, quantityTypes) => {
	if (dataTypes.length === 0) {
		return;
	}

	const REGEX = /(?<value>__[^_]*__)/g;
	const REPLACE = '"$<value>"';

	let filename = 'fhirDataTypes',
		writeToFile = `
/* ${__global.AUTO_GENERATED} - ${CAN_EDIT ? __global.ALLOW_EDIT : __global.DO_NOT_EDIT} */
`;
	for (let dataType of dataTypes) {
		let jsonSchema = JSON.parse(dataType.schema);
		if (rules[dataType.name]) {
			jsonSchema['__rule'] = rules[dataType.name].toString().replace(/[\r\n\t]/g, '');
		}
		dataType.schema = JSON.stringify(jsonSchema);

		writeToFile += `
export const ${dataType.name} = ${JSON.stringify({
			valid: true,
			...JSON.parse(dataType.schema),
		})
			.replace(/[\\]?"/g, '')
			.replace(/\s*=\s*["|']{/g, ' = {')
			.replace(/}["|'];*/g, '};')
			// we want to put parentheses back around the values
			.replace(REGEX, REPLACE)
			.replace(/"__rule": "(?<func>[^"]*)"/, '__rule: $<func>')
			.replace(/valid:(true|false)/g, '__valid:$1')};
`;
		if (dataType.name === 'Quantity') {
			for (let q of quantityTypes) {
				jsonSchema = JSON.parse(dataType.schema);
				if (rules[q]) {
					jsonSchema['__rule'] = rules[q].toString().replace(/[\r\n\t]/g, '');
				}

				dataType.schema = JSON.stringify(jsonSchema);
				writeToFile =
					writeToFile +
					`
export const ${q} = ${JSON.stringify({
						valid: true,
						...JSON.parse(dataType.schema),
					})
						.replace(/[\\]?"/g, '')
						.replace(/\s*=\s*["|']{/g, ' = {')
						.replace(/}["|'];*/g, '};')
						// we want to put parentheses back around the values
						.replace(REGEX, REPLACE)
						.replace(/"__rule": "(?<func>[^"]*)"/, '__rule: $<func>')
						.replace(/valid:(true|false)/g, '__valid:$1')};
`;
			}
		}
	}

	let getSchemaFunc = `
export const getSchema = (schema) => {
	const REGEX = /__(?<datatype>[^_]*)__/g;
	if (REGEX.test(schema)) {
		schema = schema.replace(REGEX, '$<datatype>');
	}
	return dict[\`\${schema}Const\`];
};
`;

	let mapper = (elem) => `${elem.name}Const: ${elem.name}`;
	let quantMapper = (elem) => `${elem}Const:  ${elem}`;
	writeToFile += `const dict = {${dataTypes.map(mapper)},${quantityTypes.map(quantMapper)}}`;
	writeToFile += getSchemaFunc;

	await buildDataTypeIndex(filename);

	let failure = await writeFile(filename, writeToFile, __global.DATATYPES_DIR);
	if (failure) {
		__global.FAILURES.push(failure);
	}
};

const buildDataTypeIndex = async (filename) => {
	let writeFileName = 'index';
	let writeToFile = `
/* ${__global.AUTO_GENERATED} - ${CAN_EDIT ? __global.ALLOW_EDIT : __global.DO_NOT_EDIT} */

export * from './${filename}';
export { primitiveTypes, isPrimitive, getPrimitive } from './primitiveTypes';
`;
	let failure = await writeFile(writeFileName, writeToFile, __global.DATATYPES_DIR);
	if (failure) {
		__global.FAILURES.push(failure);
	}
};

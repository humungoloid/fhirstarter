const fs = require('fs').promises;
const path = require('path');
const config = require('config');
const log = require('../utils/logging');

module.exports = async (dataTypes, quantityTypes) => {
	if (dataTypes.length === 0) {
		return;
	}

	const REGEX = /(?<value>__[^_]*__)/g;
	const REPLACE = '"$<value>"';

	let filename = 'fhirDataTypes',
		writeToFile = `
${AUTO_GENERATED}
`;
	for (let dataType of dataTypes) {
		writeToFile =
			writeToFile +
			`
export const ${dataType.name} = ${JSON.stringify(dataType.schema)
				.replace(/[\\]?"/g, '')
				.replace(/\s*=\s*["|']{/g, ' = {')
				.replace(/}["|'];*/g, '};')
				// we want to put parentheses back around the values
				.replace(REGEX, REPLACE)};
`;
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

	let quantityTypesString = `
export const QuantityVariations = [
${quantityTypes.map((elem) => `'${elem}'`).join(', ')}
];
`;
	let mapper = (elem) => `${elem.name}Const: ${elem.name}`;
	let quantMapper = (elem) => `${elem}Const: Quantity`;
	writeToFile += quantityTypesString;
	writeToFile += `const dict = {${dataTypes.map(mapper)},${quantityTypes.map(
		quantMapper
	)}}`;
	writeToFile += getSchemaFunc;

	await buildDataTypeIndex(filename);

	try {
		let file = path.resolve(DATATYPES_DIR, `${filename}.js`);
		log.info(`Writing file ${filename}.js`);
		await fs.writeFile(file, writeToFile, { flag: 'w' }, callback);
		log.success(`Successfully wrote file ${filename}.js`);
	} catch (error) {
		log.error(
			`Failed to write file ${filename}.js  - Error: ${error.message}`
		);
		FAILURES.push(filename);
	}
};

const callback = (error) => {
	if (error) {
		throw error;
	}
};

const buildDataTypeIndex = async (filename) => {
	let file = path.resolve(DATATYPES_DIR, `index.js`);
	let writeToFile = `
${AUTO_GENERATED}

export * from './${filename}';
export * from './primitiveTypes';
`;
	try {
		await fs.writeFile(file, writeToFile, { flag: 'w' }, callback);
	} catch (error) {
		log.error(`Failed to write file ${filename}.js - ${error.message}`);
		FAILURES.push(filename);
	}
};

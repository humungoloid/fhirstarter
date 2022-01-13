const fs = require('fs').promises;
const path = require('path');
const config = require('config');
const log = require('../utils/logging');
const camelCase = require('../utils/generatorUtils').camelCase;

const UTILS_DIR = config.output.dir.utils;
const DATATYPES_DIR = config.output.dir.datatypes;
const MAX_LINE_LENGTH = config.output.maxLineLength;

const VALIDATE_ARGS_NAME = 'validateArgs';

var comments = '';
var globalJson;
const needToCheck = [];

module.exports = async (dataTypes, quantityTypes, importedResources) => {
	if (dataTypes.length === 0) {
		return;
	}

	await buildValidateArgsFunctionFile();
	await buildPrimitiveTypesFile();

	let quantitySchema = dataTypes.find(
		(elem) => elem.name === 'Quantity'
	).schema;

	quantityTypes = quantityTypes.map((elem) => ({
		name: elem,
		schema: quantitySchema,
	}));

	let writeFuncs = ``,
		writeConsts = ``,
		filename = 'fhirDataTypeBuilder',
		dictEntries = '',
		exports = [];

	for (let dataType of dataTypes.concat(quantityTypes)) {
		let params = [];
		globalJson = JSON.parse(dataType.schema);
		let newParams = processObjectForDataTypeBuilders(dataType);
		params.push(...newParams);
		let functionName = `build${dataType.name}Func`,
			functionNameExport = `build${dataType.name}`,
			newConst = `const ${functionNameExport} = ${functionName};`;
		dictEntries += `${dataType.name}: ${functionNameExport},`;

		// and a function that we export on its own
		let newFunc = `
${comments}
const ${functionName} = (args) => {
	const {${params.join(', ')}} = args;
	const schema = getSchema('${dataType.name}');
	if (validateArgs(schema, args, Object.keys(args))) {
		return ${JSON.stringify(globalJson).replace(/"/g, '')}
	}
}`;
		writeFuncs += newFunc;
		writeConsts += newConst;
		exports.push(functionNameExport);

		if (newFunc.includes('__')) {
			needToCheck.push(functionName);
		}
		comments = '';
	}
	/* End of for loop */

	let imports = ``;
	for (let resource of importedResources) {
		let importFilename =
			resource.filename || `fhir${resource.name}Resource`;
		imports += `import build${resource.name}Func from './${importFilename}';`;
		dictEntries += `${resource.name}: build${resource.name},`;
		writeConsts += `const build${resource.name} = build${resource.name}Func;`;
		exports.push(`build${resource.name}`);
	}

	let checkString =
		needToCheck.length > 0
			? ` Need to check the following functions: ${needToCheck.join(
					', '
			  )}`
			: '';
	log.info(`Finished building functions.`);
	log.warning(`${checkString}`);

	let exportMapper = (elem) => `${elem}Func as ${elem}`;
	// finally, write the file
	let writeToFile = `
${AUTO_GENERATED}

import ${VALIDATE_ARGS_NAME} from './${VALIDATE_ARGS_NAME}';
import getSchema from '../datatypes';
${imports}
${writeFuncs}
${writeConsts}
dict = {${dictEntries}}
export default class FhirDataTypeBuilder {

static getBuilderFunction = (resource) => {
	return dict[resource];
}

static buildDataType = (resource, ...args) => {
	return dict[resource](...args);
}


}


export {${exports.map(exportMapper).join(', ')}};
`;

	try {
		await buildUtilsIndex(exports, filename, imports);
	} catch (error) {
		log.error(
			`failed to write index file for resource type builders - Error: ${error.message}`
		);
	}

	try {
		let file = path.resolve(UTILS_DIR, `${filename}.js`);
		log.info(`Writing file ${filename}.js`);
		await fs.writeFile(file, writeToFile, { flag: 'w' }, callback);
		log.success(`Successfully wrote file ${filename}.js`);
	} catch (error) {
		log.error(
			`Failed to write file ${filename}.js - Error: ${error.message}`
		);
		FAILURES.push(filename);
	}
};

const callback = (error) => {
	if (error) {
		throw error;
	}
};

const buildUtilsIndex = async (functionNames, importFrom, imports) => {
	let importStr = `
import FhirDataTypeBuilder, {
${functionNames.join(', ')}
} from './${importFrom}';`,
		exportStr = `
export default FhirDataTypeBuilder;
export {${functionNames.join(', ')}};
`,
		filename = 'index',
		writeToFile = `
${AUTO_GENERATED}
${importStr}

${exportStr}
`;
	try {
		let file = path.resolve(UTILS_DIR, `${filename}.js`);
		log.info(`Writing file ${filename}.js`);
		await fs.writeFile(file, writeToFile, { flag: 'w' }, callback);
		log.success(`Successfully wrote file ${filename}.js`);
	} catch (error) {
		log.error(
			`Failed to write file ${filename}.js - Error: ${error.message}`
		);
		FAILURES.push(filename);
	}
};

/**
 * Creates a file that contains an argument validation function for the data type builders
 */
const buildValidateArgsFunctionFile = async (func) => {
	func =
		func ||
		DEFAULT_ARG_VALIDATOR.replace(
			/<__validateArgs>/g,
			VALIDATE_ARGS_NAME
		).replace(/\\/g, '\\');
	let filename = VALIDATE_ARGS_NAME,
		toWrite = `
${AUTO_GENERATED}
${func}
	`;
	try {
		let file = path.resolve(UTILS_DIR, `${filename}.js`);
		log.info(`Writing file ${filename}.js`);
		await fs.writeFile(file, toWrite, { flag: 'w' }, callback);
		log.success(`Successfully wrote file ${filename}.js`);
	} catch (error) {
		log.error(
			`Failed to write file ${filename}.js - Error: ${error.message}`
		);
		FAILURES.push(filename);
	}
};

/**
 * Creates a file that contains an argument validation function for the data type builders
 */
const buildPrimitiveTypesFile = async (func) => {
	func = func || DEFAULT_PRIMITIVE_TYPES.replace(/\\/g, '\\');
	let filename = 'primitiveTypes',
		toWrite = `
${AUTO_GENERATED}
${func}
	`;
	try {
		let file = path.resolve(DATATYPES_DIR, `${filename}.js`);
		log.info(`Writing file ${filename}.js`);
		await fs.writeFile(file, toWrite, { flag: 'w' }, callback);
		log.success(`Successfully wrote file ${filename}.js`);
	} catch (error) {
		log.error(
			`Failed to write file ${filename}.js - Error: ${error.message}`
		);
		FAILURES.push(filename);
	}
};

/**
 * A recursive method that generates a json object with function parameters assigned to its properties
 * @param {Object} obj The object to process
 * @returns
 */
const processObjectForDataTypeBuilders = (obj, rootName = null) => {
	let json;
	if (typeof obj === 'string') {
		json = JSON.parse(obj);
	} else if (obj.schema) {
		json =
			typeof obj.schema === 'string'
				? JSON.parse(obj.schema)
				: obj.schema;
	} else {
		json = json instanceof Object ? obj : {};
	}
	let keys = Object.keys(json),
		params = [];
	for (let key of keys) {
		let valueType = json[key];
		if (valueType instanceof Array) {
			// we need to handle arrays
			if (typeof valueType[0] !== 'string') {
				// this means we have an object here... in this case,
				// we just create a parameter with the same name and specify
				// the structure the object should have in a comment

				let headerStars = '*'.repeat(
						Math.floor((MAX_LINE_LENGTH - key.length - 2) / 2)
					),
					footerStars = '*'.repeat(MAX_LINE_LENGTH - 1),
					commentHeader = `/${headerStars} ${key} ${headerStars}`,
					commentFooter = `${footerStars}/`;

				comments =
					comments +
					`
${commentHeader}
${JSON.stringify(valueType[0], null, 2)}
${commentFooter}
`;
			}
			let newKey = key.replace(/"/g, '');

			let paramName = camelCase(rootName, newKey);
			if (rootName) {
				globalJson[rootName][key] = paramName;
			} else {
				globalJson[key] = paramName;
			}

			params.push(paramName);
		} else if (typeof valueType !== 'string') {
			let newRootName = rootName || key;
			let newParams = processObjectForDataTypeBuilders(
				{ name: '', schema: valueType },
				newRootName
			);
			params.push(...newParams);
		} else {
			let newKey = key.replace(/"/g, '');

			let paramName = camelCase(rootName, newKey);
			if (rootName) {
				globalJson[rootName][key] = paramName;
			} else {
				globalJson[key] = paramName;
			}
			params.push(paramName);
		}
	}
	return params;
};

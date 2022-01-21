const log = require('../utils/logging');
const camelCase = require('../utils/generatorUtils').camelCase;
const writeFile = require('../utils/fileWriter');
const path = require('path');

const MAX_LINE_LENGTH = __global.__config.output.maxLineLength;
const CAN_EDIT = false;
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

	let quantitySchema = dataTypes.find((elem) => elem.name === 'Quantity').schema;

	quantityTypes = quantityTypes.map((elem) => ({
		name: elem,
		schema: quantitySchema,
	}));

	let writeFuncs = ``,
		writeConsts = ``,
		filename = 'FhirDataTypeBuilder',
		dictEntries = '',
		exports = [];

	for (let dataType of dataTypes.concat(quantityTypes)) {
		let params = [];
		globalJson = JSON.parse(dataType.schema);
		globalJson.__rule = undefined;
		globalJson.__valid = undefined;
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
	const {${params.filter((elem) => !['__rule', '__valid'].includes(elem)).join(', ')}} = args;
	const schema = getSchema('${dataType.name}');
	let valid = validateArgs(schema, args, Object.keys(args));
	return ${JSON.stringify({
		...globalJson,
		__rule: undefined,
		__valid: 'valid',
	}).replace(/"/g, '')}
	
}`;
		writeFuncs += newFunc;
		writeConsts += newConst;
		exports.push(functionNameExport);

		if (newFunc.replace(/__valid/g, 'valid').includes('__')) {
			needToCheck.push(functionName);
		}
		comments = '';
	}
	/* End of for loop */

	let imports = ``;
	for (let resource of importedResources) {
		let importFilename = resource.filename || `fhir${resource.name}Resource`;
		imports += `import build${resource.name}Func from './${importFilename}';`;
		dictEntries += `${resource.name}: build${resource.name},`;
		writeConsts += `const build${resource.name} = build${resource.name}Func;`;
		exports.push(`build${resource.name}`);
	}

	let checkString = needToCheck.length > 0 ? ` Need to check the following functions: ${needToCheck.join(', ')}` : '';
	log.info(`Finished building functions.`);
	log.warning(`${checkString}`);

	// finally, write the file
	let writeToFile = `
/* ${__global.AUTO_GENERATED} - ${CAN_EDIT ? __global.ALLOW_EDIT : __global.DO_NOT_EDIT} */

import {${VALIDATE_ARGS_NAME}} from './${VALIDATE_ARGS_NAME}';
import {getSchema} from '../datatypes';
import {getFhirSchema} from '../resource';
${imports}
${writeFuncs}
${writeConsts}
const dict = {${dictEntries}}

export const getBuilderFunction = (resource) => {
	return dict[resource];
}

export const buildDataType = (resource, ...args) => {
	return dict[resource](...args);
}`;

	try {
		await buildUtilsIndex(filename);
	} catch (error) {
		log.error(`failed to write index file for resource type builders - Error: ${error.message}`);
	}

	let failure = await writeFile(filename, writeToFile, __global.UTILS_DIR);
	if (failure) {
		__global.FAILURES.push(failure);
	}
};

const buildUtilsIndex = async (importFrom) => {
	let importStr = `
	/* ${__global.AUTO_GENERATED} - ${__global.DO_NOT_EDIT} */
	import fancyEqualityCheck from './fancyEqualityCheck';
`,
		exportStr = `
export * from './${importFrom}';
export * from './validateArgs';
export { fancyEqualityCheck };
`,
		filename = 'index',
		writeToFile = `
/* ${__global.AUTO_GENERATED} - ${CAN_EDIT ? __global.ALLOW_EDIT : __global.DO_NOT_EDIT} */
${importStr}

${exportStr}
`;
	let failure = await writeFile(filename, writeToFile, __global.UTILS_DIR);
	if (failure) {
		__global.FAILURES.push(failure);
	}
};

/**
 * Creates a file that contains an argument validation function for the data type builders
 */
const buildValidateArgsFunctionFile = async (func) => {
	func =
		func ||
		require(path.resolve(__global.__config.templatesDir, __global.__config.templates.validateArgs)) ||
		__global.DEFAULT_ARG_VALIDATOR.replace(/<__validateArgs>/g, VALIDATE_ARGS_NAME).replace(/\\/g, '\\');
	let filename = VALIDATE_ARGS_NAME,
		writeToFile = `
/* ${__global.AUTO_GENERATED} - ${CAN_EDIT ? __global.ALLOW_EDIT : __global.DO_NOT_EDIT} */
${func}
	`;
	let failure = await writeFile(filename, writeToFile, __global.UTILS_DIR);
	if (failure) {
		__global.FAILURES.push(failure);
	}
};

/**
 * Creates a file that contains an argument validation function for the data type builders
 */
const buildPrimitiveTypesFile = async (func) => {
	func =
		func ||
		require(path.resolve(__global.__config.templatesDir, __global.__config.templates.primitiveTypes)) ||
		__global.DEFAULT_PRIMITIVE_TYPES.replace(/\\/g, '\\');
	let filename = 'primitiveTypes',
		writeToFile = `
/* ${__global.AUTO_GENERATED} - ${CAN_EDIT ? __global.ALLOW_EDIT : __global.DO_NOT_EDIT} */
${func}
	`;
	let failure = await writeFile(filename, writeToFile, __global.DATATYPES_DIR);
	if (failure) {
		__global.FAILURES.push(failure);
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
		json = typeof obj.schema === 'string' ? JSON.parse(obj.schema) : obj.schema;
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

				let headerStars = '*'.repeat(Math.floor((MAX_LINE_LENGTH - key.length - 2) / 2)),
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
			let newParams = processObjectForDataTypeBuilders({ name: '', schema: valueType }, newRootName);
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

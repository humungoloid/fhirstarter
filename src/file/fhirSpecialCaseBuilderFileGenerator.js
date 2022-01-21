const log = require('../utils/logging');
const writeFile = require('../utils/fileWriter');

const MAX_LINE_LENGTH = __global.__config.output.maxLineLength;
const CAN_EDIT = false;
const ASTERISK = '*'.repeat(MAX_LINE_LENGTH);

const camelCase = require('../utils/generatorUtils').camelCase;

var comments = '';
var globalJson;
const needToCheck = [];

module.exports = async (resources) => {
	if (resources.length === 0) {
		return;
	}

	let returnFiles = [];

	for (let resourceStr of resources) {
		comments = '';
		let resource = resourceStr.schema,
			name = resourceStr.name,
			filename = `fhir${name}Resource`,
			params = [];

		globalJson = JSON.parse(resource);
		let newParams = processObjectForDataTypeBuilders(resource);
		params.push(...newParams);
		let functionName = `build${name}Func`;
		let newFunc,
			imports = [],
			addIn = '',
			paramsOne = '';

		const commonAddin = `
			const {${params.join(', ')}} = args;
			const schema = datatypes.getSchema('${name}');
			let valid = validateArgs.validateArgs(schema, args, Object.keys(args));
${addIn}
return ${JSON.stringify({ ...globalJson, __valid: 'valid' }).replace(/"/g, '')}
`;

		imports.push(`import { getSchema } from '../datatypes'`);
		imports.push(`import { validateArgs } from './validateArgs'`);
		switch (name) {
			case 'Reference':

			case 'Dosage':

			case 'Narrative':

			case 'Meta':
				addIn = commonAddin;
				break;
			case 'Extension':
				imports.push(`import {buildDataType} from '../utils'`);
				addIn = `
const {url, ${params.filter((elem) => elem !== 'url').join(', ')}} = args;
// we can only include one, so just include the first one
let argsKey = Object.keys(args)[1],
	valid = validateArgs.validatePrimitive('url', url),
	schema = argsKey.slice('value'.length),
	isPrimitiveValue = datatypes.isPrimitive(
		schema.charAt(0).toLowerCase() + schema.slice(1)
	),
	value;

if (isPrimitiveValue) {
	valid = valid && validateArgs.validatePrimitive(
		schema.charAt(0).toLowerCase() + schema.slice(1),
		args[argsKey]
	);
	value = \`"\${args[argsKey]}"\`;
} else {
	valid = valid && validateArgs.validateArgs(
		datatypes.getSchema(schema),
		args[argsKey],
		Object.keys(args[argsKey])
	);
	value = buildDataType(schema, args[argsKey]);
}
return JSON.parse(
	\`{"url":"\${url}", "\${argsKey}": \${JSON.stringify(value)}, "__valid": \${valid}}\`
);
`;
				break;
		}
		newFunc = `
			${comments}
			const ${functionName} = (args) => {
				${addIn};
			};`;

		if (newFunc.replace(/__valid/g, 'valid').includes('__')) {
			needToCheck.push(functionName);
		}
		let checkString =
			needToCheck.length > 0 ? ` Need to check the following functions: ${needToCheck.join(', ')}` : '';
		log.info(`Finished building functions.`);
		log.warning(`${checkString}`);
		returnFiles.push({ name: name, filename: filename });
		let writeToFile = `
/* ${__global.AUTO_GENERATED} - ${CAN_EDIT ? __global.ALLOW_EDIT : __global.DO_NOT_EDIT} */
${imports.join(';')}
${newFunc}

export default ${functionName}`;
		let failure = await writeFile(filename, writeToFile, __global.UTILS_DIR);
		if (failure) {
			__global.FAILURES.push(failure);
		}
	}
	/* End of for loop */
	return returnFiles;
};

const buildUtilsIndex = async (functionNames, importFrom) => {
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
		json = obj instanceof Object ? JSON.parse(JSON.stringify(obj)) : {};
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

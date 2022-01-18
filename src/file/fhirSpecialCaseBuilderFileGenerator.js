const fs = require('fs').promises;
const config = require('config');
const path = require('path');
const log = require('../utils/logging');
const breakString = require('../utils/generatorUtils').breakString;

const MAX_LINE_LENGTH = config.output.maxLineLength;

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

		globalJson = resource;
		let newParams = processObjectForDataTypeBuilders(resource);
		params.push(...newParams);
		let functionName = `build${name}Func`;
		let newFunc,
			imports = [],
			addIn = '',
			paramsOne = '';

		imports.push(`import * as datatypes from '../datatypes'`);
		imports.push(`import * as validateArgs from './validateArgs'`);
		switch (name) {
			case 'Reference':
			case 'Dosage':
			case 'Meta':
				addIn = `
				const {${params.join(', ')}} = args;
				const schema = datatypes.getSchema('${name}');
if (validateArgs.validateArgs(schema, args, Object.keys(args))) {
	${addIn}
	return ${JSON.stringify(globalJson).replace(/"/g, '')}
}`;
				break;
			case 'Extension':
				addIn = `
const {url, ${params.filter((elem) => elem !== 'url').join(', ')}} = args;
// we can only include one, so just include the first one
let argsKey = Object.keys(args)[1],
		validated = validateArgs.validatePrimitive('url', url),
		schema = argsKey.slice('value'.length);

	if (datatypes.isPrimitive(schema.charAt(0).toLowerCase() + schema.slice(1))) {
		validated =
			validated &&
			validateArgs.validatePrimitive(
				schema.charAt(0).toLowerCase() + schema.slice(1),
				args[argsKey]
			);
	} else {
		validated =
			validated &&
			validateArgs.validateArgs(
				datatypes.getSchema(schema),
				args[argsKey],
				Object.keys[args[argsKey]]
			);
	}
	if (validated) {
		return JSON.parse(\`{"url":"\${url}", "\${argsKey}": "\${args[argsKey]}"}\`);
	}
`;
				break;
		}
		newFunc = `
			${comments}
			const ${functionName} = (args) => {
				${addIn};
			};`;

		if (newFunc.includes('__')) {
			needToCheck.push(functionName);
		}
		let checkString =
			needToCheck.length > 0
				? ` Need to check the following functions: ${needToCheck.join(
						', '
				  )}`
				: '';
		log.info(`Finished building functions.`);
		log.warning(`${checkString}`);
		returnFiles.push({ name: name, filename: filename });
		let writeToFile = `
${AUTO_GENERATED}
${imports.join(';')}
${newFunc}

export default ${functionName}`;
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
	}
	/* End of for loop */
	return returnFiles;
};

const callback = (error) => {
	if (error) {
		throw error;
	}
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
${AUTO_GENERATED}
${importStr}

${exportStr}
`;
	try {
		let file = path.resolve(UTILS_DIR, `index.js`);
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

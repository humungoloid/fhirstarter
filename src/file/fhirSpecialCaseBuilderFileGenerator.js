const fs = require('fs').promises;
const config = require('config');
const path = require('path');
const log = require('../utils/logging');
const breakString = require('../utils/generatorUtils').breakString;

const MAX_LINE_LENGTH = config.output.maxLineLength;

const ASTERISK = '*'.repeat(MAX_LINE_LENGTH);

const camelCase = require('../utils/generatorUtils').camelCase;

const UTILS_DIR = config.output.dir.utils;

var comments = '';
var globalJson;
const needToCheck = [];

module.exports = async (resources) => {
	if (resources.length === 0) {
		return;
	}

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
		// and a function tha we export on its own

		switch (name) {
			case 'Reference':
			case 'Dosage':
			case 'Meta':
				imports.push(`import validateArgs from './validateArgs'`);
				imports.push(`import getSchema from '../datatypes';`);
				addIn = `
				let schema = getSchema('${name}');
if (validateArgs(schema, arguments[0])) {
	${addIn}
	return ${JSON.stringify(globalJson).replace(/"/g, '')}
}`;
				break;
			case 'Extension':
				paramsOne = 'url, ';
				addIn = `
let args = arguments[1];
let argsKeys = Object.keys(args);

if (argsKeys.length === 1) {
	return JSON.parse(\`{"url":"\${url}", "\${argsKeys}": "\${args[argsKeys].value}"}\`);
}
`;
				break;
		}
		newFunc = `
			${comments}
			const ${functionName} = (${paramsOne}{${params.join(', ')}} = {}) => {
				${addIn};
			}`;

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

		let writeToFile = `
			${AUTO_GENERATED}
			${imports.join(';')}
			${newFunc}`;
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

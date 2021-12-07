const FhirJsonFetcher = require('./fhirJsonFetcher');
const { processResourceJson } = require('./fhirResourceSchemaGenerator');
const fs = require('fs').promises;
const path = require('path');
const prettyjson = require('prettyjson');
const outputDir = path.resolve(__dirname, '../output');

const MAX_DEPTH_FOR_OBJECT_PROCESSING = 0;
const REMOVE_UNDERSCORE_REGEX = /__(?<value>[^_]*)__/;
const AUTO_GENERATED = '/* This file was generated automagically by Matt */';

const failures = [];

var verbose = true;

const buildIndex = async (resources) => {
	if (resources.length === 0) {
		return;
	}
	let resourceList = '',
		importAll = `
${AUTO_GENERATED}
`,
		filename = 'index';
	for (let json of resources.map((elem) =>
		JSON.stringify(JSON.parse(elem).schema)
	)) {
		let fhirResource = JSON.parse(json)['resourceType'];
		let importStatement = `import ${fhirResource}Resource from './${fhirResource}Resource';`;
		if (json) {
			importAll = importAll + importStatement;
			resourceList = resourceList + `${fhirResource},`;
		}
	}

	try {
		let exportStatement = `export { ${resourceList
			.split(',')
			.map((elem) => `${elem}Resource`)} };`;
		let writeToFile = `${importAll}${exportStatement}`;
		let file = `${outputDir}/${filename}.js`;
		verbose && console.log(`File: ${file}`);
		await fs.writeFile(file, writeToFile, callback);
		verbose && console.log(`Successfully wrote file ${filename}.js`);
	} catch {
		verbose && console.log(`Failed to write file ${filename}.js`);
		failures.push(filename);
	}
};

const callback = (error) => {
	if (error) {
		throw error;
	}
};

const DO_NOT_EXTEND_DOMAINRESOURCE = ['Bundle', 'Parameters', 'Binary'];
const ASTERISK = '**********************************************************************************************'
const MAX_LINE_LENGTH = ASTERISK.length - 10;


const buildFile = async (resource) => {
	let json = JSON.parse(resource),
		schema = json.schema,
		resourceName = json.name,
		extend = DO_NOT_EXTEND_DOMAINRESOURCE.includes(resourceName)
			? 'Resource'
			: 'DomainResource',
		reference = json.reference,
		description = json.description,
		filename = `${resourceName}Resource` || '__failed';
	try {
		let toWrite = 
`${AUTO_GENERATED}
/${ASTERISK}
Resource: ${resourceName}
Reference: ${reference}
${breakString(description, MAX_LINE_LENGTH)}
${ASTERISK}/


import Fhir${extend} from './Fhir${extend}';
// import FhirDataTypeBuilder from '../utils'; // uncomment this line if needed for building generator functions

class ${resourceName}Resource extends Fhir${extend} {
	// we have a couple generator functions that can be specified as needed
	// mostly though we can get away with using the generator in the super class
	// if null is passed to super.generateJson, it will default to the base method
	jsonGenerator = null; // (rawData, schema) => json
	fhirGenerator = null; // (rawData, schema) => fhir

constructor(resourceString) {
	super(resourceString);
}

generateJson = () => this.json = this.json || super.generateJson(jsonGenerator);
generateFhir = () => this.fhir = this.fhir || super.generateJson(fhirGenerator);

schema = ${JSON.stringify(schema, null, 4)};
}
`;
		let file = `${outputDir}/${filename}.js`;
		verbose && console.log(`File: ${file}`);
		await fs.writeFile(file, toWrite, callback);
		verbose && console.log(`Successfully wrote file ${filename}.js`);
	} catch {
		verbose && console.log(`Failed to write file ${filename}.js`);
		failures.push(filename);
	}
};

const breakString = (str, limit) => {
	let result = '';
	for(let i = 0, count = 0; i < str.length; i++){
	   if(count >= limit && str[i] === ' '){
		  count = 0;
		  result += '\n';
	   }else{
		  count++;
		  result += str[i];
	   }
	}
	return result;
 }

/**
 *
 * @param {string} key The name of the array
 * @param {Array} valueArray The object to process
 * @param {number} depth The maximum allowable depth in case we come across any nested objects
 */
const buildParameterNameFromArray = async (key, valueArray, depth = 0) => {
	if (depth >= MAX_DEPTH_FOR_OBJECT_PROCESSING) {
		return [];
	}
	let result = [];
	let value = valueArray[0];
	if (value instanceof Object) {
		let keys = Object.keys(value);
	}
};

const buildIndexForBuilders = async (importFrom) => {
	let filename = 'builders_index',
		importStr = `import FhirDataTypeBuilder from './${importFrom}';`,
		exportStr = `export default FhirDataTypeBuilder;`,
		writeToFile = `
${AUTO_GENERATED}
${importStr}

${exportStr}
`;
	try {
		let file = `${outputDir}/${filename}.js`;
		verbose && console.log(`Writing file ${filename}.js`);
		await fs.writeFile(file, writeToFile, callback);
		verbose && console.log(`Successfully wrote file ${filename}.js`);
	} catch {
		verbose && console.log(`Failed to write file ${filename}.js`);
		failures.push(filename);
	}
};

var comments = '';

/**
 * A recursive method that generates a json object with function parameters assigned to its properties
 * @param {Object} obj The object to process
 * @returns
 */
const processObjectForDataTypeBuilders = (obj, rootName = null) => {
	let json;
	if (typeof obj === 'string') {
		json = JSON.parse(obj);
	} else if (obj.schema && typeof obj.schema === 'string') {
		json = JSON.parse(obj.schema);
	} else if (obj.schema) {
		json = obj.schema;
	} else if (json instanceof Object) {
		json = obj;
	} else {
		json = {};
	}

	let keys = Object.keys(json),
		params = [];
	for (let key of keys) {
		let valueType = json[key],
			value;
		if (valueType instanceof Array) {
			// we need to handle arrays
			if (typeof valueType[0] !== 'string') {
				// this means we have an object here... in this case,
				// we just create a parameter with the same name and specify
				// the structure the object should have in a comment
				comments =
					comments +
					`
				/*******${key}******
				${JSON.stringify(valueType[0], null, 2)}
				*/
				`;
				value = `${key}Array`;
			} else {
				// otherwise it's a string representing a basic datatype
				value = `${valueType[0]
					.replace(REMOVE_UNDERSCORE_REGEX, '$<value>')
					.replace(/[|()]*/g, '')}Array`;
			}
			let newKey = key.replace(/"/g, '');

			let paramName = camelCase(rootName, newKey, value);
			if (!rootName) {
				globalJson[key] = paramName;
			} else {
				globalJson[rootName][key] = paramName;
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
			value = valueType
				.replace(REMOVE_UNDERSCORE_REGEX, '$<value>')
				.replace(/[|()]*/g, '');
			let newKey = key.replace(/"/g, '');

			let paramName = camelCase(rootName, newKey, value);
			if (!rootName) {
				globalJson[key] = paramName;
			} else {
				globalJson[rootName][key] = paramName;
			}
			params.push(paramName);
		}
	}
	return params;
};

const camelCase = (...args) => {
	let result = '';
	if (
		args.filter((elem) => typeof elem === 'string').length != args.length &&
		args[0] !== null
	) {
		throw new Error('All arguments must be strings');
	}
	for (let arg of args) {
		if (result === '') {
			if (arg === null) {
				continue;
			}
			result = result + `${arg.charAt(0).toLowerCase()}${arg.slice(1)}`;
		} else {
			result = result + `${arg.charAt(0).toUpperCase()}${arg.slice(1)}`;
		}
	}
	return result;
};

var globalJson;

const needToCheck = [];

const buildDataTypeBuildersFile = async (dataTypes) => {
	if (dataTypes.length === 0) {
		return;
	}
	let writeFuncs = ``,
		writeStatics = ``;

	let filename = 'fhirDataTypeBuilder';

	for (let dataType of dataTypes) {
		let params = [];
		globalJson = JSON.parse(dataType.schema);
		let newParams = processObjectForDataTypeBuilders(dataType);
		params.push(...newParams);
		let functionName = `build${dataType['name']}`;

		// create a static function for the class definition
		let newStatic = `static ${functionName} = ${functionName};`;

		// and a function tha we export on its own
		let newString = `
${comments}
	export function ${functionName}(${params.join(', ')}) {
		if (validateArgs(...arguments)) {
			return ${JSON.stringify(globalJson).replace(/"/g, '')}
		}
	}`;

		writeFuncs = writeFuncs + newString;
		writeStatics = writeStatics + newStatic;

		if (newString.includes('__')) {
			needToCheck.push(functionName);
		}
	}

	let checkString =
		needToCheck.length > 0
			? ` Need to check the following functions: ${needToCheck.join(
					', '
			  )}`
			: '';
	console.log(`Finished building functions.${checkString}`);

	// finally, write the file
	let writeToFile = `
${AUTO_GENERATED}
import validateArgs from './validateArgs';
export default class FhirDataTypeBuilder {
	${writeStatics}
}

${writeFuncs}
`;

	try {
		buildIndexForBuilders(filename);
	} catch {
		verbose &&
			console.log(
				'failed to write index file for resource type builders'
			);
	}

	try {
		let file = `${outputDir}/${filename}.js`;
		verbose && console.log(`Writing file ${filename}.js`);
		await fs.writeFile(file, writeToFile, callback);
		verbose && console.log(`Successfully wrote file ${filename}.js`);
	} catch {
		verbose && console.log(`Failed to write file ${filename}.js`);
		failures.push(filename);
	}
};

const buildDataTypeFile = async (dataTypes) => {
	if (dataTypes.length === 0) {
		return;
	}
	let filename = 'fhirDataTypes',
		writeToFile = `
${AUTO_GENERATED}
`;
	for (let dataType of dataTypes) {
		writeToFile =
			writeToFile +
			`export const ${dataType.name} = ${JSON.stringify(
				dataType.schema
			)};`;
	}

	try {
		let file = `${outputDir}/${filename}.js`;
		verbose && console.log(`Writing file ${filename}.js`);
		await fs.writeFile(file, writeToFile, callback);
		verbose && console.log(`Successfully wrote file ${filename}.js`);
	} catch (error) {
		verbose &&
			console.log(
				`Failed to write file ${filename}.js - ${error.message}`
			);
		failures.push(filename);
	}
};

const buildFiles = async (resources, dataTypePages, useVerbose = true) => {
	verbose = useVerbose;
	console.log('Writing files...');
	try {
		buildDataTypeBuildersFile(dataTypePages);
		buildDataTypeFile(dataTypePages);
		buildIndex(resources);
		for (let resource of resources) {
			buildFile(resource);
		}
	} finally {
		console.log('Finished writing files.');
		let failuresString =
			failures.length === 0 ? '' : ` - ${failures.join(', ')}`;
		let color = failures.length > 0 ? '\x1b[41m' : '\x1b[32m';
		console.log(
			`${color}Failures: (${failures.length})${failuresString}\x1b[0m`
		);
	}
};

module.exports = {
	buildFile: buildFile,
	buildFiles: buildFiles,
	buildIndex: buildIndex,
};

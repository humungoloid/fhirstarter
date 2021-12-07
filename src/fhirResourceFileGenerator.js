const FhirJsonFetcher = require('./fhirJsonFetcher');
const { processResourceJson } = require('./fhirResourceSchemaGenerator');
const fs = require('fs').promises;
const path = require('path');

const REMOVE_UNDERSCORE_REGEX = /__(?<value>[^_]*)__/;
const AUTO_GENERATED = '/* This file was generated automagically by Matt */';

const BASE_DIR = '../output';
const RESOURCES_DIR = 'resource';
const UTILS_DIR = 'utils';
const DATATYPES_DIR = 'datatypes';

const CLEAR_DIRECTORIES = true;

const DO_NOT_EXTEND_DOMAINRESOURCE = ['Bundle', 'Parameters', 'Binary'];
const ASTERISK =
	'**********************************************************************************************';
const MAX_LINE_LENGTH = ASTERISK.length - 10;

var comments = '';
var globalJson;
const needToCheck = [];

const failures = [];

var VERBOSE = true;

const callback = (error) => {
	if (error) {
		throw error;
	}
};

/*************** MAIN ***************/
const buildFiles = async (
	resources,
	dataTypePages,
	quantityTypes,
	useVerbose = true
) => {
	VERBOSE = useVerbose;
	await makeDirs();
	console.log('Writing files...');
	try {
		dataTypePages &&
			dataTypePages.length > 0 &&
			buildDataTypeBuilderFile(dataTypePages, quantityTypes);
		dataTypePages &&
			dataTypePages.length > 0 &&
			buildDataTypeFile(dataTypePages, quantityTypes);
		resources && resources.length > 0 && buildResourceIndex(resources);
		if (resources && resources.length > 0) {
			for (let resource of resources) {
				buildResourceFile(resource);
			}
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
/************* END MAIN *************/
/********** INDEX BUILDERS **********/
const buildDataTypeIndex = async (filename) => {
	let file = path.resolve(__dirname, BASE_DIR, DATATYPES_DIR, `index.js`);
	let writeToFile = `
${AUTO_GENERATED}
import getSchema from './${filename}';

export * from './${filename}';
export default getSchema;
`;
	try {
		await fs.writeFile(file, writeToFile, { flag: 'w' }, callback);
	} catch (error) {
		VERBOSE &&
			console.log(
				`Failed to write file ${filename}.js - ${error.message}`
			);
		failures.push(filename);
	}
};

const buildResourceIndex = async (resources) => {
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

	let mapping = (elem) => `${elem}Resource`;

	try {
		let exportStatement = `export { ${resourceList
			.split(',')
			.map(mapping)} };`;
		let writeToFile = `${importAll}${exportStatement}`;
		let file = path.resolve(__dirname, BASE_DIR, RESOURCES_DIR, `index.js`);
		VERBOSE && console.log(`File: ${file}`);
		await fs.writeFile(file, writeToFile, { flag: 'w' }, callback);
		VERBOSE && console.log(`Successfully wrote file ${filename}.js`);
	} catch {
		VERBOSE && console.log(`Failed to write file ${filename}.js`);
		failures.push(filename);
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
		let file = path.resolve(__dirname, BASE_DIR, UTILS_DIR, `index.js`);
		VERBOSE && console.log(`Writing file ${filename}.js`);
		await fs.writeFile(file, writeToFile, { flag: 'w' }, callback);
		VERBOSE && console.log(`Successfully wrote file ${filename}.js`);
	} catch {
		VERBOSE && console.log(`Failed to write file ${filename}.js`);
		failures.push(filename);
	}
};
/********* END INDEX BUILDERS *********/
/*********** FILE BUILDERS ***********/
const buildDataTypeFile = async (dataTypes, quantityTypes) => {
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
			`export const ${dataType.name} = ${JSON.stringify(dataType.schema)
				.replace(/[\\]?"/g, '')
				.replace(/\s*=\s*["|']{/g, ' = {')
				.replace(/}["|'];*/g, '};')
				// we want to put parentheses back around the values
				.replace(REGEX, REPLACE)};`;
	}

	let getSchemaFunc = 
`
export default getSchema = (schema) => {
	return dict[\`\${schema}Const\`]
}
`
	

	let quantityTypesString = `
export const QuantityVariations = [
	${quantityTypes.map((elem) => `'${elem}'`).join(', ')}
];
`;
	let mapper = (elem) => `${elem.name}Const: ${elem.name}`;
	let quantMapper = (elem) => `${elem}Const: Quantity`;
	writeToFile += quantityTypesString;
	writeToFile += `const dict = {${dataTypes.map(mapper)},${quantityTypes.map(quantMapper)}}`
	writeToFile += getSchemaFunc;

	await buildDataTypeIndex(filename);

	try {
		let file = path.resolve(
			__dirname,
			BASE_DIR,
			DATATYPES_DIR,
			`${filename}.js`
		);
		VERBOSE && console.log(`Writing file ${filename}.js`);
		await fs.writeFile(file, writeToFile, { flag: 'w' }, callback);
		VERBOSE && console.log(`Successfully wrote file ${filename}.js`);
	} catch (error) {
		VERBOSE &&
			console.log(
				`Failed to write file ${filename}.js - ${error.message}`
			);
		failures.push(filename);
	}
};

const buildDataTypeBuilderFile = async (dataTypes, quantityTypes) => {
	if (dataTypes.length === 0) {
		return;
	}

	let quantitySchema = dataTypes.find(elem => elem.name === 'Quantity').schema

	quantityTypes = quantityTypes.map(elem => ({name: elem, schema: quantitySchema}));

	let writeFuncs = ``,
		writeStatics = ``,
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
			newStatic = `static ${functionNameExport} = ${functionName};`;
		dictEntries += `${dataType.name}: this.${functionNameExport},`;

		// and a function tha we export on its own
		let newFunc = `
${comments}
const ${functionName} = ({${params.join(', ')}}) => {
	let schema = getSchema('${dataType.name}');
	if (validateArgs(schema, ...arguments)) {
		return ${JSON.stringify(globalJson).replace(/"/g, '')}
	}
}`;
		writeFuncs += newFunc;
		writeStatics += newStatic;
		exports.push(functionNameExport);

		if (newFunc.includes('__')) {
			needToCheck.push(functionName);
		}
		comments = '';
	}

	let checkString =
		needToCheck.length > 0
			? ` Need to check the following functions: ${needToCheck.join(
					', '
			  )}`
			: '';
	console.log(`Finished building functions.${checkString}`);

	let exportMapper = (elem) => `${elem}Func as ${elem}`
	// finally, write the file
	let writeToFile = `
${AUTO_GENERATED}
import validateArgs from './validateArgs';
import getSchema from '../datatypes';
export default class FhirDataTypeBuilder {
	dict = {${dictEntries}}

	static getBuilderFunction = (resource) => {
		return dict[resource];
	}

	static buildDataType = (resource, ...args) => {
		return dict[resource](...args);
	}

	${writeStatics}
}

${writeFuncs}
export {${exports.map(exportMapper).join(', ')}};
`;

	try {
		buildUtilsIndex(exports, filename);
	} catch {
		VERBOSE &&
			console.log(
				'failed to write index file for resource type builders'
			);
	}

	try {
		let file = path.resolve(
			__dirname,
			BASE_DIR,
			UTILS_DIR,
			`${filename}.js`
		);
		VERBOSE && console.log(`Writing file ${filename}.js`);
		await fs.writeFile(file, writeToFile, { flag: 'w' }, callback);
		VERBOSE && console.log(`Successfully wrote file ${filename}.js`);
	} catch {
		VERBOSE && console.log(`Failed to write file ${filename}.js`);
		failures.push(filename);
	}
};

const buildResourceFile = async (resource) => {
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
		let toWrite = `${AUTO_GENERATED}
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
		let file = path.resolve(
			__dirname,
			BASE_DIR,
			RESOURCES_DIR,
			`${filename}.js`
		);
		VERBOSE && console.log(`File: ${file}`);
		await fs.writeFile(file, toWrite, { flag: 'w' }, callback);
		VERBOSE && console.log(`Successfully wrote file ${filename}.js`);
	} catch {
		VERBOSE && console.log(`Failed to write file ${filename}.js`);
		failures.push(filename);
	}
};
/********* END FILE BUILDERS *********/
/************** HELPERS **************/
const makeDirs = async () => {
	let dirs = [
		path.resolve(__dirname, BASE_DIR, RESOURCES_DIR),
		path.resolve(__dirname, BASE_DIR, DATATYPES_DIR),
		path.resolve(__dirname, BASE_DIR, UTILS_DIR),
	];
	console.log('Creating directories...');
	for (let dir of dirs) {
		try {
			let files = await fs.readdir(dir);
			if (CLEAR_DIRECTORIES) {
				for (let file of files) {
					fs.unlink(path.resolve(dir, file));
				}
			}
		} catch {
			try {
				fs.mkdir(resourceDir, { recursive: true });
			} catch {
				console.log(
					`Unable to create directory '${dir}' - error: ${error.message}`
				);
			}
		}
	}
	console.log('Finished creating directories');
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

const breakString = (str, limit) => {
	str = str.replace(/\s{2,}/g, '\n\n');
	let result = '';
	for (let i = 0, count = 0; i < str.length; i++) {
		if (str[i] === '\n') {
			count = 0;
			result += str[i];
		}
		if (count >= limit && str[i] === ' ') {
			count = 0;
			result += '\n';
		} else {
			count++;
			result += str[i];
		}
	}
	return result;
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
				value = `${key}Array`;
			} else {
				// otherwise it's a string representing a basic datatype
				value = `${valueType[0]
					.replace(REMOVE_UNDERSCORE_REGEX, '$<value>')
					.replace(/[|()]*/g, '')}Array`;
			}
			let newKey = key.replace(/"/g, '');

			let paramName = camelCase(rootName, newKey);
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

			let paramName = camelCase(rootName, newKey);
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
/************ END HELPERS ************/

module.exports.buildFiles = buildFiles;

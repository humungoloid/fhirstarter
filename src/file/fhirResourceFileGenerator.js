const breakString = require('../utils/generatorUtils').breakString;
const camelCase = require('../utils/generatorUtils').camelCase;
const writeFile = require('../utils/fileWriter');
const generateUnitTestFile = require('./fhirResourceUnitTestFileGenerator').generateUnitTestFile;
const getExample = require('../fetcher/fhirExampleFetcher').getExample;
const generateColumnMappingFile = require('./fhirResourceColumnMappingFileGenerator').generateColumnMappingFile;
const log = require('../utils/logging');
const generateGetSchemaUnitTestFile = require('./fhirResourceUnitTestFileGenerator').generateGetSchemaUnitTestFile;

const DO_NOT_EXTEND_DOMAINRESOURCE = __global.__config.processing.extendOnlyBaseResource;
const MAX_LINE_LENGTH = __global.__config.output.maxLineLength;
const CAN_EDIT = false;
const ASTERISK = '*'.repeat(MAX_LINE_LENGTH);

const _generateFields = (schema) => {
	let fields = [];
	_generateFieldsInner(schema, fields, '');

	return fields;
};

const _schemaFile = async (schemaName, schema) => {
	let filename = schemaName,
		schemaConst = `const ${schemaName} = ${JSON.stringify(schema, null, 4)};`,
		exportStmt = `export default ${schemaName}`,
		writeToFile = `
	/* ${__global.AUTO_GENERATED} - ${__global.DO_NOT_EDIT} */
	${schemaConst}
	${exportStmt}
	`;
	let failure = await writeFile(filename, writeToFile, __global.SCHEMA_DIR);
	if (failure) {
		__global.FAILURES.push(failure);
	}
};

const _getNewResourceFile = async (resources) => {
	if (resources.length === 0) {
		return 1;
	}
	let resourceList = new Array(),
		filename = 'getNewResource';
	for (let name of resources.map((elem) => JSON.parse(elem).name)) {
		if (name) {
			resourceList.push(name);
		}
	}

	let func = `
const dict = _.fromPairs(
	_.map(resources, (elem) => [_.toUpper(elem), \`\${elem}Resource\`])
);
/**
* Creates a new FHIR resource object of the type specified, using the data provided
* @param {string} resourceType The type of resource to create
* @param {Object} rawData A JSON object containing the raw data to be processed
* @returns The new FHIR resource object with fields containing the provided data
*/
export const getNewResource = async (resourceType, rawData) => {
	try {
		let Resource = await import(\`./\${dict[_.toUpper(resourceType)]}.js\`);

		if (!!Resource) {
			return new Resource.default(rawData);
		}
	} catch (error) {
		console.error(\`Could not create \${resourceType}: \${error}\`);
	}
};`;

	let writeToFile = `
/* ${__global.AUTO_GENERATED} - ${__global.DO_NOT_EDIT} */
import _ from 'lodash';
const dict = [${resourceList.join(',')}]

${func}
	`;
	let failure = await writeFile(filename, writeToFile, __global.RESOURCES_DIR);
	if (failure) {
		__global.FAILURES.push(failure);
	}
};
module.exports = {
	/**
	 * Builds an index.js file used to export all of the created FHIR resource classes
	 * @param {Array} resources An array of resource names
	 * @returns 0 if successful, 1 otherwise.
	 */
	buildResourceIndex: async (resources) => {
		if (resources.length === 0) {
			return 1;
		}
		let filename = 'index';

		_getNewResourceFile(resources);

		let exportStatement = `export { getNewResource, getColumnMapping, buildColumnList, getFhirSchema };`;
		let writeToFile = `
/* ${__global.AUTO_GENERATED} - ${__global.DO_NOT_EDIT} */
import {getNewResource} from './getNewResource';
import {getFhirSchema} from './getFhirSchema';
import {getColumnMapping, buildColumnList} from './columnMapping'

${exportStatement}
		`;
		let failure = await writeFile(filename, writeToFile, __global.RESOURCES_DIR);
		if (failure) {
			__global.FAILURES.push(failure);
		}
		return 0;
	},

	/**
	 * Builds a .js file containing a class that represents the provided FHIR resource.
	 * @param {*} resource The name of the resource whose file is to be generated
	 */
	buildResourceFile: async (resource) => {
		let json = JSON.parse(resource),
			schema = json.schema,
			resourceName = json.name,
			extend = DO_NOT_EXTEND_DOMAINRESOURCE.includes(resourceName) ? 'Resource' : 'DomainResource',
			reference = json.reference,
			description = json.description,
			filename = `${resourceName}Resource` || '__failed';
		if (typeof schema === 'string') {
			schema = JSON.parse(schema);
		}
		let fields = _generateFields(schema);
		try {
			let example = await getExample(json.name);
			await generateUnitTestFile(example, fields);
		} catch (error) {
			log.warning(
				`Unable to generate unit test file for ${resourceName}, most likely example could not be retrieved`
			);
		}

		generateColumnMappingFile(resource, fields);
		let schemaName = camelCase(`${resourceName}Schema`);

		let writeToFile = `
/* ${__global.AUTO_GENERATED} - ${CAN_EDIT ? __global.ALLOW_EDIT : __global.DO_NOT_EDIT} */

import { Fhir${extend} } from '../base';
import ${schemaName} from './schemata/${schemaName}';
/${ASTERISK}
Resource: ${resourceName}
Reference: ${reference}
${breakString(description, MAX_LINE_LENGTH)}
${ASTERISK}/

export default class ${resourceName}Resource extends Fhir${extend} {
${fields.join(';')};

constructor(resourceString) {
	super(resourceString, ${schemaName});
	this.resourceType = '${resourceName}';
	this.populateFields();
}

}
	`;
		_schemaFile(schemaName, schema);
		let failure = await writeFile(filename, writeToFile, __global.RESOURCES_DIR);
		if (failure) {
			__global.FAILURES.push(failure);
		}
	},

	/**
	 * Writes a file containing the schemas for all of the different FHIR resource types.
	 * @param {Array} resources An array of JSON objects representing FHIR resource schema
	 */
	buildGetSchemaFile: async (resources) => {
		let filename = 'getFhirSchema';
		generateGetSchemaUnitTestFile(resources);

		let writeToFile = `
/* ${__global.AUTO_GENERATED} - ${CAN_EDIT ? __global.ALLOW_EDIT : __global.DO_NOT_EDIT} */
export const ${filename} = (resourceName) => import(\`'./schemata/\${resourceName.charAt(0).toLowerCase() + resourceName.slice(1)}Schema.js\`)

	`;
		let failure = await writeFile(filename, writeToFile, __global.RESOURCES_DIR);
		if (failure) {
			__global.FAILURES.push(failure);
		}
	},

	generateGetNewResourceFile: _getNewResourceFile,
	generateFields: _generateFields,
	generateSchemaFile: _schemaFile,
};

const _generateFieldsInner = (schema, fields, rootName) => {
	let keys = Object.keys(schema);
	for (let key of keys) {
		if (key === 'resourceType') {
			continue;
		}
		let field = '';
		if (schema[key] instanceof Array) {
			let initializer;
			if (typeof schema[key][0] === 'string') {
				initializer = '[]';
			} else {
				initializer = '[{}]';
			}
			field = `${buildParamNameString(rootName, rootName === '' ? '' : '_', key)} = ${initializer}`;
		} else if (typeof schema[key] === 'string') {
			field = `${buildParamNameString(rootName, rootName === '' ? '' : '_', key)}`;
		} else {
			_generateFieldsInner(schema[key], fields, buildParamNameString(rootName, rootName === '' ? '' : '_', key));
		}
		if (field !== '' && field.toUpperCase() !== 'RESOURCETYPE') {
			fields.push(field);
		}
	}
};

const buildParamNameString = (...args) => {
	return [...args].reduce((a, b) => `${a}${b}`);
};

const fs = require('fs').promises;
const config = require('config');
const path = require('path');
const log = require('../utils/logging');
const breakString = require('../utils/generatorUtils').breakString;
const camelCase = require('../utils/generatorUtils').camelCase;

const DO_NOT_EXTEND_DOMAINRESOURCE = config.processing.extendOnlyBaseResource;
const MAX_LINE_LENGTH = config.output.maxLineLength;

const ASTERISK = '*'.repeat(MAX_LINE_LENGTH);
const callback = (error) => {
	if (error) {
		throw error;
	}
};

const generateFields = (schema) => {
	let fields = [];
	generateFieldsInner(schema, fields, '');

	return fields;
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
			let file = path.resolve(RESOURCES_DIR, `index.js`);
			log.info(`File: ${file}`);
			await fs.writeFile(file, writeToFile, { flag: 'w' }, callback);
			log.success(`Successfully wrote file ${filename}.js`);
		} catch (error) {
			log.error(
				`Failed to write file ${filename}.js - Error: ${error.message}`
			);
			FAILURES.push(filename);
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
			extend = DO_NOT_EXTEND_DOMAINRESOURCE.includes(resourceName)
				? 'Resource'
				: 'DomainResource',
			reference = json.reference,
			description = json.description,
			filename = `${resourceName}Resource` || '__failed';
		let fields = generateFields(schema);
		let schemaName = camelCase(`${resourceName}Schema`);
		try {
			let toWrite = `
${AUTO_GENERATED}

import { Fhir${extend} } from '../base';
// import FhirDataTypeBuilder from '../utils'; // uncomment this line if needed for building generator functions

/${ASTERISK}
Resource: ${resourceName}
Reference: ${reference}
${breakString(description, MAX_LINE_LENGTH)}
${ASTERISK}/

export default class ${resourceName}Resource extends Fhir${extend} {
${fields.join(' ')}

constructor(resourceString) {
	super(resourceString, ${schemaName});
	this.resourceType = '${resourceName}';
	this.populateFields();
}

}
const ${schemaName} = ${JSON.stringify(schema, null, 4)};
	`;
			let file = path.resolve(RESOURCES_DIR, `${filename}.js`);
			log.info(`File: ${file}`);
			await fs.writeFile(file, toWrite, { flag: 'w' }, callback);
			log.success(`Successfully wrote file ${filename}.js`);
		} catch (error) {
			log.error(
				`Failed to write file ${filename}.js - Error: ${error.message}`
			);
			FAILURES.push(filename);
		}
	},

	/**
	 * Writes a file containing the schemas for all of the different FHIR resource types.
	 * @param {Array} schemaArray An array of JSON objects representing FHIR resource schema
	 */
	buildSchemaFile: async (schemaArray) => {
		let filename = 'FhirSchemas';
		try {
			let schemaStrings = schemaArray
				.map(
					(elem) =>
						`${elem.resourceType}: \`${JSON.stringify(
							elem,
							null,
							4
						)}\``
				)
				.join(',');

			let toWrite = `
${AUTO_GENERATED}

const fhirSchemas = 
{
	${schemaStrings}
}

export default fhirSchemas;
	`;
			let file = path.resolve(RESOURCES_DIR, `${filename}.js`);
			log.info(`File: ${file}`);
			await fs.writeFile(file, toWrite, { flag: 'w' }, callback);
			log.success(`Successfully wrote file ${filename}.js`);
		} catch (error) {
			log.error(
				`Failed to write file ${filename}.js - Error: ${error.message}`
			);
			FAILURES.push(filename);
		}
	},

	generateFields: generateFields,
};

const generateFieldsInner = (schema, fields, rootName) => {
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
			field = `${buildParamNameString(
				rootName,
				rootName === '' ? '' : '_',
				key
			)} = ${initializer};`;
		} else if (typeof schema[key] === 'string') {
			field = `${buildParamNameString(
				rootName,
				rootName === '' ? '' : '_',
				key
			)};`;
		} else {
			generateFieldsInner(
				schema[key],
				fields,
				buildParamNameString(rootName, rootName === '' ? '' : '_', key)
			);
		}
		if (field !== '' && field.toUpperCase() !== 'RESOURCETYPE') {
			fields.push(field);
		}
	}
};

const buildParamNameString = (...args) => {
	return [...args].reduce((a, b) => `${a}${b}`);
};

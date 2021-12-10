const axios = require('axios');
const HTMLParser = require('node-html-parser');
const SchemaGenerator = require('../processors/fhirResourceProcessor');
const fs = require('fs').promises;
const resources = require('../resources');
const log = require('../logging');
const path = require('path');

const outputDir = path.resolve(__dirname, '../output');

const FHIR_BASE_URL = `https://www.hl7.org/fhir`;
//const MULTIVALUE_REGEX = /\[{(?<value>[^}\/]*)}]*,\s*\/\/\s*(?<comment>[^"]*)\\r\\n)/

const verbose = true;

const instance = axios.create({
	baseURL: FHIR_BASE_URL,
	timeout: 60000,
	headers: { 'X-Requested-With': 'XMLHttpRequest' },
	transformResponse: [(data) => data],
});

const successes = [];
const failures = [];

var dataTypePage, metaDataTypePage;

const hasData = () => {
	return !!dataTypePage && !!metaDataTypePage;
};

/**
 *
 * @returns {Object} An object containing data type and metadata type pages
 */
const fetchAllPages = async () => {
	const result = {
		dataTypesPage: null,
		metaDataTypesPage: null,
	};

	try {
		let response = await getDataTypesPage('/datatypes.html');
		log.success('Retrieved data types');
		result.dataTypesPage = response.data;
	} catch (error) {
		log.error(`Failed to fetch datatypes - Error: ${error.message}`);
	}

	try {
		let responseTwo = await getDataTypesPage('/metadatatypes.html');
		log.success('Retrieved metadata datatypes');
		result.metaDataTypesPage = responseTwo.data;
	} catch (error) {
		log.error(`failed in fetchAllPages - Error: ${error.message}`);
	}

	return result;
};

const handlePages = async (resources, dataTypes, metaDataTypes) => {
	resources = resources || resources.allResources;
	dataTypes = dataTypes || resources.allDataTypes;
	metaDataTypes = metaDataTypes || resources.allMetadataTypes;
	let dataTypeSchemas = [],
		resourceSchemas = [],
		result;

	for (let page of resources) {
		try {
			result = await getFhirPage(page);
			resourceSchemas.push(result);
		} catch (error) {
			log.error(`Failed to fetch ${page} - Error: ${error.message}`);
		}
	}

	for (let dataType of dataTypes) {
		try {
			result = await getDataType(dataType);
			dataTypeSchemas.push({ name: dataType, schema: result });
		} catch (error) {
			log.error(`Failed to fetch ${dataType} - Error: ${error.message}`);
		}
	}

	for (let metaDataType of metaDataTypes) {
		try {
			result = await getMetaDataType(metaDataType);
			dataTypeSchemas.push({ name: metaDataType, schema: result });
		} catch (error) {
			log.error(
				`Failed to fetch ${metaDataType} - Error: ${error.message}`
			);
		}
	}

	return { resources: resourceSchemas, dataTypes: dataTypeSchemas };
};

const getDataTypesPage = async (page) => {
	let response = instance.get(page);
	return response;
};

const getFhirPage = async (resourceName) => {
	let response = await instance.get(`/${resourceName}.html`);
	let data = HTMLParser.parse(response.data);
	let child = HTMLParser.parse(
		data.querySelector('#tabs-json').querySelector('#json-inner')
			.childNodes[1].childNodes[0].innerText
	);
	let rawJson = '',
		description,
		reference = `${FHIR_BASE_URL}/${resourceName}.html`;

	try {
		description = data
			.querySelector('#segment-content')
			.querySelectorAll('h2')
			.filter(
				(elem) =>
					elem.childNodes &&
					elem.childNodes.length >= 2 &&
					elem.childNodes[1].rawText.includes('Scope and Usage')
			)[0]
			.parentNode.querySelectorAll('p')
			.map((elem) => elem.innerText)
			.join('');
	} catch {
		log.error(
			`Unable to process resource ${resourceName} - Error: ${error.message}`
		);
	}

	child.childNodes.map((elem) => (rawJson = rawJson + elem.innerText));
	let result = '';
	try {
		result = SchemaGenerator.processResourceJson(rawJson, resourceName);
		log.success(`Successfully processed ${resourceName}`);
		successes.push(resourceName);
	} catch (error) {
		log.error(
			`Unable to process ${resourceName} - Error: ${error.message}`
		);
		failures.push(resourceName);
	}
	return JSON.stringify({
		name: resourceName,
		description: description,
		reference: reference,
		schema: result,
	});
};

const processPageData = (response, dataType) => {
	try {
		let data = HTMLParser.parse(response.data),
			childOne = data.querySelector(`#tabs-${dataType}-json`),
			child = HTMLParser.parse(
				childOne.querySelector(`#json`).querySelector(`#json-inner`)
					.childNodes[1].childNodes[0].innerText
			),
			rawJson = '';
		child.childNodes.map((elem) => (rawJson = rawJson + elem.innerText));
		let result = SchemaGenerator.processResourceJson(rawJson);

		log.success(`Successfully processed ${dataType}`);
		return JSON.stringify(result);
	} catch (error) {
		log.error(`Unable to process ${dataType} - Error: ${error.message}`);
	}
};

const getDataType = async (dataType) => {
	try {
		let response = await instance.get(`datatypes.html`);
		return processPageData(response, dataType);
	} catch (error) {
		log.error(`Unable to fetch ${dataType} - Error: ${error.message}`);
	}
};

const getMetaDataType = async (dataType) => {
	try {
		let response = await instance.get(`metadatatypes.html`);
		return processPageData(response, dataType);
	} catch (error) {
		log.error(`Unable to fetch ${dataType} - Error: ${error.message}`);
	}
};

const getPage = async (page) => {};

module.exports = {
	fetchAll: fetchAllPages,
	handlePages: handlePages,
	getDataTypesPage: getDataTypesPage,
	getMetaDataType: getMetaDataType,
	getFhirPage: getFhirPage,
	getDataType: getDataType,
};

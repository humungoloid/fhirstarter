const axios = require('axios');
const HTMLParser = require('node-html-parser');
const SchemaGenerator = require('./fhirResourceSchemaGenerator');
const fs = require('fs').promises;

const path = require('path');

const outputDir = path.resolve(__dirname, '../output');

const FHIR_BASE_URL = `https://www.hl7.org/fhir`;
//const MULTIVALUE_REGEX = /\[{(?<value>[^}\/]*)}]*,\s*\/\/\s*(?<comment>[^"]*)\\r\\n)/

const verbose = true;

const instance = axios.create({
	baseURL: FHIR_BASE_URL,
	timeout: 120000,
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

		console.log('Got data types');
		result.dataTypesPage = response.data;
		let responseTwo = await getDataTypesPage('/metadatatypes.html');
		console.log('Got metadata types');
		result.metaDataTypesPage = responseTwo.data;
	} catch {
		console.log('failed in fetchAllPages');
	}
	return result;
};

const handlePages = async (
	resourcesToWorkWith,
	dataTypesToWorkWith,
	metaDataTypes
) => {
	let dataTypeSchemas = [],
		resourceSchemas = [],
		result;

	for (let page of resourcesToWorkWith) {
		try {
			result = await getFhirPage(page);
			resourceSchemas.push(result);
		} catch {
			console.log(`failed: ${page}`);
		}
	}

	for (let dataType of dataTypesToWorkWith) {
		try {
			result = await getDataType(dataType);
			dataTypeSchemas.push({ name: dataType, schema: result });
		} catch {
			console.log(`failed: ${dataType}`);
		}
	}

	for (let metaDataType of metaDataTypes) {
		try {
			result = await getMetaDataType(metaDataType);
			dataTypeSchemas.push({ name: metaDataType, schema: result });
		} catch {
			console.log(`failed: ${metaDataType}`);
		}
	}

	return { resources: resourceSchemas, dataTypes: dataTypeSchemas };
};

const getDataTypesPage = async (page) => {
	let response = instance.get(page);
	console.log('response successful');
	resolve(response);
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
		try {
			description = data
				.querySelector('#segment-content')
				.querySelector('[name=scope]')
				.parentNode.querySelectorAll('p')
				.map((elem) => elem.innerText)
				.join('');
		} catch {
			try {
				description = data
					.querySelector('#segment-content')
					.querySelector('[name=bnc]')
					.parentNode.querySelectorAll('p')
					.map((elem) => elem.innerText)
					.join('');
			} catch {
				try {
					description = data
					.querySelector('#segment-content')
					.querySelectorAll('h2')
					.filter(
						(elem) =>
							elem.childNodes &&
							elem.childNodes.length >= 2 &&
							elem.childNodes[1].rawText.includes(
								'Scope and Usage'
							)
					)[0]
					.nextSibling.map((elem) => elem.innerText)
					.join('');
				} catch {
					console.log(`Tried everything, still failed. Resource: ${resourceName}`)
				}
			}
		}
	}

	child.childNodes.map((elem) => (rawJson = rawJson + elem.innerText));
	let result = '';
	try {
		result = SchemaGenerator.processResourceJson(rawJson, resourceName);
		console.log(`Success: ${resourceName}`);
		successes.push(resourceName);
	} catch {
		console.log(`Failed: ${resourceName}`);
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
	let data = HTMLParser.parse(response.data),
		childOne = data.querySelector(`#tabs-${dataType}-json`),
		child = HTMLParser.parse(
			childOne.querySelector(`#json`).querySelector(`#json-inner`)
				.childNodes[1].childNodes[0].innerText
		),
		rawJson = '';
	child.childNodes.map((elem) => (rawJson = rawJson + elem.innerText));
	let result = SchemaGenerator.processResourceJson(rawJson);

	console.log(`Success: ${dataType}`);
	return JSON.stringify(result);
};

const getDataType = async (dataType) => {
	let response = await instance.get(`datatypes.html`);
	try {
		return processPageData(response, dataType);
	} catch {
		reject('getDataType failed');
	}
};

const getMetaDataType = async (dataType) => {
	try {
		let response = await instance.get(`metadatatypes.html`);
		return processPageData(response, dataType);
	} catch {
		reject('getMetaDataType failed');
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

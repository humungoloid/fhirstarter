const HTMLParser = require('node-html-parser');
const SchemaGenerator = require('../processors/fhirResourceProcessor');
const log = require('../utils/logging');
const getSpecialCases = require('./fhirSpecialCaseFetcher').getSpecialCases;
const getCustomResources = require('./customJsonFetcher');

const FHIR_BASE_URL = __global.__config.http.baseUrl;
const DATATYPES_PAGE = __global.__config.http.dataTypes;
const METADATATYPES_PAGE = __global.__config.http.metadataTypes;

var dataTypePage;
var metadataTypePage;

module.exports = {
	fetchAll: async (resources, dataTypes, metaDataTypes, specialCases, customResources) => {
		resources = resources || resources.allResources;
		dataTypes = dataTypes || resources.allDataTypes;
		metaDataTypes = metaDataTypes || resources.allMetadataTypes;
		specialCases = specialCases || resources.allSpecialCases;
		customResources = customResources || resources.customResources;
		let dataTypeSchemas = [],
			resourceSchemas = [],
			specialCaseSchemas = [],
			result;

		for (let page of resources) {
			try {
				result = await getFhirPage(page);
				resourceSchemas.push(result);
			} catch (error) {
				log.error(`Failed to fetch ${page} - Error: ${error.message}`);
			}
		}

		// for (let resource of __global.CUSTOM_RESOURCES) {
		// 	resourceSchemas.push(JSON.stringify(resource));
		// }

		let customResourceSchemas = await getCustomResources(customResources);
		for (let customResource of customResourceSchemas) {
			resourceSchemas.push(JSON.stringify(customResource));
		}

		try {
			result = await getSpecialCases(specialCases);
			specialCaseSchemas = result;
		} catch (error) {
			log.error(`Failed to fetch special cases - Error: ${error.message}`);
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
				log.error(`Failed to fetch ${metaDataType} - Error: ${error.message}`);
			}
		}

		return {
			resources: resourceSchemas,
			dataTypes: dataTypeSchemas,
			specialCases: specialCaseSchemas,
		};
	},
};

const getFhirPage = async (resourceName) => {
	let response = await __global.HTTP.get(`/${resourceName}.html`);
	let data = HTMLParser.parse(response.data);
	let child = HTMLParser.parse(
		data.querySelector('#tabs-json').querySelector('#json-inner').childNodes[1].childNodes[0].innerText
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
			.join('')
			.replace(/(?<c>[^\s])\r\n/g, '$<c> ')
			.replace(/(?<c>[^.]\s*)\r\n/g, '$<c>');
	} catch {
		log.warning(`Unable to get a description for ${resourceName}`);
		description = 'No description could be found for this resource';
	}

	child.childNodes.map((elem) => (rawJson = rawJson + elem.innerText));
	let result = '';
	try {
		result = SchemaGenerator.processResourceJson(rawJson, resourceName);
		log.success(`Successfully processed ${resourceName}`);
	} catch (error) {
		log.error(`Unable to process ${resourceName} - Error: ${error.message}`);
		__global.FAILURES.push(resourceName);
	}
	return JSON.stringify({
		name: resourceName,
		description: description,
		reference: reference,
		schema: result,
	});
};

const processPageData = (dataType, page, validator) => {
	try {
		let childOne = page.querySelector(`#tabs-${dataType}-json`),
			child = HTMLParser.parse(
				childOne.querySelector(`#json`).querySelector(`#json-inner`).childNodes[1].childNodes[0].innerText
			),
			rawJson = '';
		child.childNodes.map((elem) => (rawJson = rawJson + elem.innerText));
		let result = {
			// from Element
			extension: ['__Extension__'],
			...SchemaGenerator.processResourceJson(rawJson),
		};

		log.success(`Successfully processed ${dataType}`);
		return JSON.stringify(result);
	} catch (error) {
		log.error(`Unable to process ${dataType} - Error: ${error.message}`);
	}
};

const getDataType = async (dataType) => {
	try {
		if (!dataTypePage) {
			let response = await __global.HTTP.get(DATATYPES_PAGE);
			dataTypePage = HTMLParser.parse(response.data);
		}
		return processPageData(dataType, dataTypePage);
	} catch (error) {
		log.error(`Unable to fetch ${dataType} - Error: ${error.message}`);
	}
};

const getMetaDataType = async (dataType) => {
	try {
		if (!metadataTypePage) {
			let response = await __global.HTTP.get(METADATATYPES_PAGE);
			metadataTypePage = HTMLParser.parse(response.data);
		}
		return processPageData(dataType, metadataTypePage);
	} catch (error) {
		log.error(`Unable to fetch ${dataType} - Error: ${error.message}`);
	}
};

require('dotenv').config();

process.env['NODE_CONFIG_DIR'] = './';
const config = require('config');

const FhirJsonFetcher = require('./fetcher/fhirJsonFetcher');
const FhirResourceFileGenerator = require('./file/fhirResourceFileGenerator');
const resources = require('./resources');

(async function () {
	let result = await FhirJsonFetcher.handlePages(
		resources.allResources,
		resources.allDataTypes,
		resources.allMetadataTypes
	);
	await FhirResourceFileGenerator.buildFiles(
		result.resources,
		result.dataTypes,
		resources.allQuantityTypes
	);
})();

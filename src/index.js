require('dotenv').config();
const log = require('./utils/logging');
__global = require('./utils/globals');

const handlePages = require('./fetcher/fhirJsonFetcher');
const FileGenerator = require('./file/fileGenerator');
const resources = require('./data/resources');
const handleArgs = require('./utils/handleArgs');

(async function (args) {
	handleArgs(args);
	try {
		let result = await handlePages.fetchAll(
			resources.allResources,
			resources.allDataTypes,
			resources.allMetadataTypes,
			resources.allSpecialCases,
			resources.customResources
		);
		await FileGenerator.buildFiles(
			result.resources,
			result.dataTypes,
			resources.allQuantityTypes,
			result.specialCases
		);

		log.success('Finished!');
		let logFunc = __global.FAILURES.length === 0 ? log.success : log.error;
		logFunc(`Failures: [${__global.FAILURES.join(', ')}]`);
	} catch (error) {
		log.error(`Failed - Error: ${error.message}`);
	}
})(process.argv);

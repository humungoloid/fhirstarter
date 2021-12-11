require('dotenv').config();
const config = require('config');
const log = require('./utils/logging');

global.VERBOSE = config.get('logging.level') === true;
global.AUTO_GENERATED = config.headerComment;
global.FAILURES = [];
global.NESTING = 0;

const handlePages = require('./fetcher/fhirJsonFetcher');
const FileGenerator = require('./file/fileGenerator');
const resources = require('./data/resources');
const ImagingStudyResource = require('../../../omega-ui/app/core/src/fhir/resource/ImagingStudyResource');

(async function () {
	try {
		let result = await handlePages(
			resources.allResources,
			resources.allDataTypes,
			resources.allMetadataTypes
		);
		await FileGenerator.buildFiles(
			result.resources,
			result.dataTypes,
			resources.allQuantityTypes
		);
		log.success('Finished!');
		let logFunc = FAILURES.length === 0 ? log.success : log.error;
		logFunc(`Failures: [${FAILURES.join(', ')}]`);
	} catch (error) {
		log.error(`Failed - Error: ${error.message}`);
	}
})();

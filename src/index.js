require('dotenv').config();
const log = require('./utils/logging');
const initGlobals = require('./utils/globals');
initGlobals();
const handlePages = require('./fetcher/fhirJsonFetcher');
const FileGenerator = require('./file/fileGenerator');
const resources = require('./data/resources');
const fhirResourceUnitTestFileGenerator = require('./file/fhirResourceUnitTestFileGenerator');
const handleArgs = require('./utils/handleArgs');

(async function (args) {
	handleArgs(args);
	try {
		let result = await handlePages.fetchAll(
			resources.allResources,
			resources.allDataTypes,
			resources.allMetadataTypes,
			resources.allSpecialCases
		);
		await FileGenerator.buildFiles(
			result.resources,
			result.dataTypes,
			resources.allQuantityTypes,
			result.specialCases
		);

		await fhirResourceUnitTestFileGenerator.buildUnitTestFiles(
			result.resources.map((elem) => JSON.parse(elem).name)
		);
		log.success('Finished!');
		let logFunc = FAILURES.length === 0 ? log.success : log.error;
		logFunc(`Failures: [${FAILURES.join(', ')}]`);
	} catch (error) {
		log.error(`Failed - Error: ${error.message}`);
	}
})(process.argv);

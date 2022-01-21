const log = require('../utils/logging');
const buildDataTypeBuilderFile = require('./dataTypeBuilderFileGenerator');
const buildDataTypeFile = require('./dataTypeFileGenerator');
const ResourceGenerator = require('./fhirResourceFileGenerator');
const buildSpecialCasesFiles = require('./fhirSpecialCaseBuilderFileGenerator');
const buildColumnMappingFiles = require('./fhirResourceColumnMappingFileGenerator').generateColumnMappingFiles;
const buildFhirBaseFiles = require('./fhirBaseFilesGenerator').generateFhirBaseFiles;
const generateRootIndexFile = require('./rootIndexFileGenerator').generateRootIndexFile;
const generateGetNewResourceUnitTestFile =
	require('./fhirResourceUnitTestFileGenerator').generateGetNewResourceUnitTestFile;
const generateFhirExtensionUrlsFile = require('./fhirExtensionUrlFileGenerator').generateFhirExtensionUrlsFile;
const generatefancyEqualityCheckFile = require('./fhirResourceUnitTestFileGenerator').generatefancyEqualityCheckFile;
const makeDirs = require('../utils/generatorUtils').makeDirs;

module.exports = {
	callback: (error) => {
		if (error) {
			throw error;
		}
	},

	buildFiles: async (resources, dataTypePages, quantityTypes, specialCases) => {
		await makeDirs(false);
		let specialCasesFiles;
		log.info('Writing files...');
		try {
			buildFhirBaseFiles();
			dataTypePages &&
				dataTypePages.length > 0 &&
				buildDataTypeFile(dataTypePages.concat(specialCases), quantityTypes);
			resources && resources.length > 0 && ResourceGenerator.buildResourceIndex(resources);
			resources && resources.length > 0 && buildColumnMappingFiles(resources);

			await ResourceGenerator.buildGetSchemaFile(resources);

			if (resources && resources.length > 0) {
				for (let resource of resources) {
					ResourceGenerator.buildResourceFile(resource);
				}
			}
			if (specialCases && specialCases.length > 0) {
				specialCasesFiles = await buildSpecialCasesFiles(specialCases);
			}

			dataTypePages &&
				dataTypePages.length > 0 &&
				buildDataTypeBuilderFile(dataTypePages, quantityTypes, specialCasesFiles);
			generateFhirExtensionUrlsFile();
			generateGetNewResourceUnitTestFile();
			generateRootIndexFile();
			generatefancyEqualityCheckFile();
		} finally {
			log.info('Finished writing files.');
			let failuresString = __global.FAILURES.length === 0 ? '' : ` - ${__global.FAILURES.join(', ')}`;
			let colour = failuresString === '' ? '\x1b[32m' : '\x1b[31m';
			log.info(`${colour}Failures: (${__global.FAILURES.length})${failuresString}\x1b[0m`);
		}
	},
};

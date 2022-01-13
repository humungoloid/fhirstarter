const log = require('../utils/logging');
const config = require('config');
const buildDataTypeBuilderFile = require('./dataTypeBuilderFileGenerator');
const buildDataTypeFile = require('./dataTypeFileGenerator');
const ResourceGenerator = require('./fhirResourceFileGenerator');
const buildSpecialCasesFiles = require('./fhirSpecialCaseBuilderFileGenerator');
const makeDirs = require('../utils/generatorUtils').makeDirs;

module.exports = {
	callback: (error) => {
		if (error) {
			throw error;
		}
	},

	buildFiles: async (
		resources,
		dataTypePages,
		quantityTypes,
		specialCases
	) => {
		await makeDirs();
		let specialCasesFiles;
		log.info('Writing files...');
		try {
			dataTypePages &&
				dataTypePages.length > 0 &&
				buildDataTypeFile(
					dataTypePages.concat(specialCases),
					quantityTypes
				);
			resources &&
				resources.length > 0 &&
				ResourceGenerator.buildResourceIndex(resources);
			let schemaArray = resources.map((elem) => JSON.parse(elem).schema);
			schemaArray &&
				schemaArray.length > 0 &&
				(await ResourceGenerator.buildSchemaFile(schemaArray));
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
				buildDataTypeBuilderFile(
					dataTypePages,
					quantityTypes,
					specialCasesFiles
				);
		} finally {
			log.info('Finished writing files.');
			let failuresString =
				FAILURES.length === 0 ? '' : ` - ${FAILURES.join(', ')}`;
			let colour = failuresString === '' ? '\x1b[32m' : '\x1b[31m';
			log.info(
				`${colour}Failures: (${FAILURES.length})${failuresString}\x1b[0m`
			);
		}
	},
};

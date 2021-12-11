const log = require('../utils/logging');
const buildDataTypeBuilderFile = require('./dataTypeBuilderFileGenerator');
const buildDataTypeFile = require('./dataTypeFileGenerator');
const buildResourceIndex =
	require('./fhirResourceFileGenerator').buildResourceIndex;
const buildResourceFile =
	require('./fhirResourceFileGenerator').buildResourceFile;
const makeDirs = require('../utils/generatorUtils').makeDirs;

module.exports = {
	callback: (error) => {
		if (error) {
			throw error;
		}
	},

	buildFiles: async (resources, dataTypePages, quantityTypes) => {
		await makeDirs();
		log.info('Writing files...');
		try {
			dataTypePages &&
				dataTypePages.length > 0 &&
				buildDataTypeBuilderFile(dataTypePages, quantityTypes);

			dataTypePages &&
				dataTypePages.length > 0 &&
				buildDataTypeFile(dataTypePages, quantityTypes);
			resources && resources.length > 0 && buildResourceIndex(resources);
			if (resources && resources.length > 0) {
				for (let resource of resources) {
					buildResourceFile(resource);
				}
			}
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

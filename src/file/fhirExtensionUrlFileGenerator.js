const writeFile = require('../utils/fileWriter');
const path = require('path');

const __extensionIndex = async () => {
	let filename = 'index';
	let idx = `import fhirExtensionUrls from './fhirExtensionUrls';
	
	export { fhirExtensionUrls };
	`;
	let failure = await writeFile(filename, idx, __global.EXTENSION_DIR);
	if (failure) {
		__global.FAILURES.push(failure);
	}
};

const __extUrls = async (func) => {
	func = (
		func ||
		require(path.resolve(__global.__config.templatesDir, __global.__config.templates.fhirExtensionUrls)) ||
		__global.EXTENSION_URL_DEF
	).replace(/\\/g, '\\');
	let filename = 'fhirExtensionUrls',
		writeToFile = `
/* ${__global.AUTO_GENERATED} - ${__global.DO_NOT_EDIT} */
${func}
	`;
	let failure = await writeFile(filename, writeToFile, __global.EXTENSION_DIR);
	if (failure) {
		__global.FAILURES.push(failure);
	}
};

module.exports = {
	generateExtensionIndexFile: __extensionIndex,
	generateFhirExtensionUrlsFile: () => {
		__extUrls();
		__extensionIndex();
	},
};

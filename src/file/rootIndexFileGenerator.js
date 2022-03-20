const writeFile = require('../utils/fileWriter');
const path = require('path');
const __rootIndex = async () => {
	let filename = 'index';
	let func =
		require(path.resolve(__global.__config.templatesDir, __global.__config.templates.FhirDomainResource)) ||
		__global.FHIR_DOMAIN_RESOURCE_CLASS_DEF.replace(/\\/g, '\\');
	let idx = `
	/* ${__global.AUTO_GENERATED} - ${__global.DO_NOT_EDIT} */
	${func}
	`;
	let failure = await writeFile(filename, idx, __global.ROOT_DIR);
	if (failure) {
		__global.FAILURES.push(failure);
	}
};

module.exports = {
	generateRootIndexFile: __rootIndex,
};

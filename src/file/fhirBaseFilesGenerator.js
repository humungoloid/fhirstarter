const writeFile = require('../utils/fileWriter');
const path = require('path');

const __fhirResource = async (func) => {
	let filename = 'FhirResource';
	func =
		func ||
		require(path.resolve(
			__global.__config.templatesDir,
			__global.__config.templates.FhirResource
		)) ||
		__global.FHIR_RESOURCE_CLASS_DEF.replace(/\\/g, '\\');
	let failure = await writeFile(filename, func, __global.FHIRBASE_DIR);
	if (failure) {
		__global.FAILURES.push(failure);
	}
};

const __fhirDomainResource = async (func) => {
	let filename = 'FhirDomainResource';
	func =
		func ||
		require(path.resolve(
			__global.__config.templatesDir,
			__global.__config.templates.FhirDomainResource
		)) ||
		__global.FHIR_DOMAIN_RESOURCE_CLASS_DEF.replace(/\\/g, '\\');
	let failure = await writeFile(filename, func, __global.FHIRBASE_DIR);
	if (failure) {
		__global.FAILURES.push(failure);
	}
};
const __baseIndex = async () => {
	let filename = 'index';
	let idx = `import FhirDomainResource from './FhirDomainResource';
	import FhirResource from './FhirResource';
	
	export { FhirDomainResource, FhirResource };
	`;
	let failure = await writeFile(filename, idx, __global.FHIRBASE_DIR);
	if (failure) {
		__global.FAILURES.push(failure);
	}
};

module.exports = {
	generateFhirResourceFile: __fhirResource,
	generateFhirDomainResourceFile: __fhirDomainResource,
	generateFhirBaseIndex: __baseIndex,

	generateFhirBaseFiles: async () => {
		__fhirResource();
		__fhirDomainResource();
		__baseIndex();
	},
};

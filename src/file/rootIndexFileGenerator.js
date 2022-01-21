const writeFile = require('../utils/fileWriter');

const __rootIndex = async () => {
	let filename = 'index';
	let idx = `
	/* ${__global.AUTO_GENERATED} - ${__global.DO_NOT_EDIT} */
	import { FhirDomainResource, FhirResource } from './base';
	import { buildDataType, getBuilderFunction, fancyEqualityCheck } from './utils';
	import { getSchema, primitiveTypes, isPrimitive, getPrimitive } from './datatypes';
	import { buildColumnList, getNewResource, getColumnMapping, getFhirSchema } from './resource';
	import { fhirExtensionUrls } from './extension'
	export {
		FhirDomainResource,
		FhirResource,
		buildDataType,
		getBuilderFunction,
		getSchema,
		primitiveTypes,
		isPrimitive,
		buildColumnList,
		getNewResource,
		getColumnMapping,
		fhirExtensionUrls,
		fancyEqualityCheck,
		getFhirSchema,
		getPrimitive,
	};
	`;
	let failure = await writeFile(filename, idx, __global.ROOT_DIR);
	if (failure) {
		__global.FAILURES.push(failure);
	}
};

module.exports = {
	generateRootIndexFile: __rootIndex,
};

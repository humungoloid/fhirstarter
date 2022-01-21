const path = require('path');
const { dirname } = require('path');
const appDir = dirname(require.main.filename);
const config = require(path.resolve(appDir, '../.fhirstarter-config'));
const axios = require('axios');
const prettier = require('prettier');

const prettifyConfig = (() => {
	return prettier.resolveConfig.sync(path.resolve(appDir, '..'));
})();

const exps = {
	FILES_WRITTEN: new Array(),
	PRETTY_CONFIG: prettifyConfig,
	__config: config,
	VERBOSE: config.logging.level,
	MAPPING_FUNCTION_IS_DEFAULT: config.mappingFunctionIsDefault,
	AUTO_GENERATED: config.headerComment,
	ALLOW_EDIT: config.canBeEditedComment,
	DO_NOT_EDIT: config.doNotEditComment,
	PRETTIFY: config.output.prettify,
	FAILURES: [],
	HTTP: axios.create({
		baseURL: config.http.baseUrl,
		timeout: config.http.timeoutMs,
		headers: { 'X-Requested-With': 'XMLHttpRequest' },
		//transformResponse: [(data) => data],
	}),
	ROOT_DIR: config.output.root || './output',
	FHIRBASE_DIR: config.output.dir.fhirBase || 'base',
	RESOURCES_DIR: config.output.dir.resource || 'resource',
	UTILS_DIR: config.output.dir.utils || 'utils',
	DATATYPES_DIR: config.output.dir.datatypes || 'datatypes',
	EXTENSION_DIR: config.output.dir.extension || 'extension',
	COLUMN_MAPPING_DIR: config.output.dir.columnMapping || 'resource/columnMapping',
	SCHEMA_DIR: config.output.dir.schemata || 'resource/schemata',
	DEFAULT_ARG_VALIDATOR: require('../../.fhirstarter/templates/_argValidatorFunction'),
	DEFAULT_PRIMITIVE_TYPES: require('../../.fhirstarter/templates/_primitiveTypesTemplate'),
	DEFAULT_COLUMN_LIST_BUILDER_FUNCTION: require('../../.fhirstarter/templates/_buildColumnListFunction'),
	FHIR_RESOURCE_CLASS_DEF: require('../../.fhirstarter/templates/_fhirResourceClass'),
	FHIR_DOMAIN_RESOURCE_CLASS_DEF: require('../../.fhirstarter/templates/_fhirDomainResourceClass'),
	GET_NEW_RESOURCE_UNIT_TEST_DEF: require('../../.fhirstarter/templates/_getNewResourceUnitTest'),
	EXTENSION_URL_DEF: require('../../.fhirstarter/templates/_fhirExtensionUrls'),
	CUSTOM_IMAGINGSTUDYWORKLIST_COLUMNS: require('../../.fhirstarter/templates/_customImagingStudyWorklistColumns'),
	EQUALITY_CHECK_FUNCTION: require('../../.fhirstarter/templates/_equalityCheckFunction'),
	EQUALITY_CHECK_UNIT_TEST: require('../../.fhirstarter/templates/_equalityCheckFunctionUnitTest'),
	CUSTOM_RESOURCES: require(config.templates.customResources || '../../.fhirstarter/templates/_customResources'),
};

global.__global = exps;

module.exports = exps;

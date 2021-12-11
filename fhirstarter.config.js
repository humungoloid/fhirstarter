require('dotenv').config();
const path = require('path');
const defer = require('config/defer').deferConfig;

const env = process.env.NODE_ENV;
process.env.FHIR_BASE_OUTPUTDIR ??= './output';

const dev = {
	headerComment: '/* Generated automagically by FhirStarter*/',
	templates: {
		resourceClass: null,
		functionBuilderClass: null,
		dataTypes: null,
	},
	output: {
		dir: {
			base: process.env.FHIR_BASE_OUTPUTDIR,
			resource: path.resolve(
				process.env.FHIR_BASE_OUTPUTDIR,
				process.env.FHIR_RESOURCE_OUTPUTDIR || 'resource'
			),
			utils: path.resolve(
				process.env.FHIR_BASE_OUTPUTDIR,
				process.env.FHIR_UTILS_OUTPUTDIR || 'utils'
			),
			datatypes: path.resolve(
				process.env.FHIR_BASE_OUTPUTDIR,
				process.env.FHIR_DATATYPES_OUTPUTDIR || 'datatypes'
			),
		},
		prettify: true,
		maxLineLength: process.env.FHIR_OUTPUT_MAXLINELENGTH || 120,
		cleanupDirectories: true,
	},
	http: {
		timeoutMs: 60000,
		baseUrl: 'https://www.hl7.org/fhir',
		resourceList: 'resourcelist.html',
		dataTypes: 'datatypes.html',
		metadataTypes: 'metadatatypes.html',
	},
	logging: {
		level: 'verbose',
	},
	processing: {
		extendOnlyBaseResource: ['Bundle', 'Parameters', 'Binary'],
	},
};

const config = {
	dev,
};

module.exports = config['dev'];

const path = require('path');
const defer = require('config/defer').deferConfig;

module.exports = {
	templates: {
		resourceClass: null,
		functionBuilderClass: null,
		dataTypes: null,
	},
	output: {
		dir: {
			base: defer(() => path.resolve(__dirname, 'output')),
			resource: defer(() => path.resolve(this.base, 'resource')),
			utils: defer(() => path.resolve(this.base, 'utils')),
			datatypes: defer(() => path.resolve(this.base, 'datatypes')),
		},
		prettify: true,
		maxLineLength: 90,
		cleanupDirectories: true,
	},
	http: {
		baseUrl: 'https://www.hl7.org/fhir',
		resourceList: 'resourcelist.html',
		dataTypes: 'datatypes.html',
		metadataTypes: 'metadatatypes.html',
	},
	logging: {
		level: 'verbose',
		verbose: defer(() => this.level === 'verbose'),
	},
};

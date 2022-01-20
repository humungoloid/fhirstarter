const axios = require('axios');
const HTMLParser = require('node-html-parser');
const SchemaGenerator = require('../processors/fhirResourceProcessor');
const log = require('../utils/logging');
const imagingStudyWorklistExample = require('./../data/imagingStudyWorklistExample');
const config = require('config');

const getExampleInner = async (resource) => {
	let result;
	if (resource === 'ImagingStudyWorklist') {
		result = JSON.stringify(
			JSON.parse(imagingStudyWorklistExample.replace(/\s/g, ''))
		);
	} else {
		let page = await HTTP.get(`${resource}-examples.html`);
		let examples = HTMLParser.parse(page.data)
			.querySelector('.list')
			.querySelectorAll('tr')[1]
			.querySelectorAll('td')[3]
			.querySelector('a').attributes.href;
		let response = await HTTP.get(examples);
		let data = HTMLParser.parse(response.data);
		let parsed = data
			.querySelector('.example')
			.querySelector('pre', '#json')
			.innerText.replace(/&quot;/g, '"');

		result = JSON.stringify(JSON.parse(parsed));
	}

	return {
		name: resource,
		schema: result,
	};
};

module.exports = {
	getExamples: async (resources) => {
		resources = resources || resources.allResources;
		let resourceSchemas = [],
			result;

		for (let page of resources) {
			try {
				result = await getExampleInner(page);
				resourceSchemas.push(result);
			} catch (error) {
				log.error(`Failed to fetch ${page} - Error: ${error.message}`);
			}
		}

		return resourceSchemas;
	},

	getExample: getExampleInner,
};

const axios = require('axios');
const HTMLParser = require('node-html-parser');
const SchemaGenerator = require('../processors/fhirResourceProcessor');
const log = require('../utils/logging');
const imagingStudyWorklistExample = require('./../data/imagingStudyWorklistExample');

const getExampleInner = async (resource) => {
	let result;
	if (resource === 'ImagingStudyWorklist') {
		result = JSON.stringify(imagingStudyWorklistExample);
	} else {
		let url, page, response;
		if (specificExamples[resource]) {
			url = specificExamples[resource];
			response = await __global.HTTP.get(url);
		} else {
			url = `${resource}-examples.html`;
			page = await __global.HTTP.get(url);
			let examples = HTMLParser.parse(page.data)
				.querySelector('.list')
				.querySelectorAll('tr')[1]
				.querySelectorAll('td')[3]
				.querySelector('a').attributes.href;
			response = await __global.HTTP.get(examples);
		}

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

const specificExamples = { Medication: 'medicationexample0306.json.html' };

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

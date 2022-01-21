const HTMLParser = require('node-html-parser');
const SchemaGenerator = require('../processors/fhirResourceProcessor');
const log = require('../utils/logging');

module.exports = {
	getSpecialCases: async (resources) => {
		let result,
			specialCaseSchemas = [];
		for (let resource of resources) {
			try {
				result = await getSpecialCase(resource);
				specialCaseSchemas.push(result);
			} catch (error) {
				log.error(
					`Failed to fetch ${resource.name} - Error: ${error.message}`
				);
			}
		}
		return specialCaseSchemas;
	},
};

const getSpecialCase = async (resource) => {
	let response = await __global.HTTP.get(`${resource.url}`);
	let data = HTMLParser.parse(response.data);
	let child = HTMLParser.parse(
		data
			.querySelector(`#tabs-${resource.name}-json`)
			.querySelector('#json-inner').childNodes[1].childNodes[0].innerText
	);
	let rawJson = '',
		result;

	child.childNodes.map((elem) => (rawJson = rawJson + elem.innerText));
	try {
		result = JSON.stringify({
			id: '__id__',
			extension: ['__Extension__'],
			...SchemaGenerator.processResourceJson(rawJson, resource.name),
		});
		log.success(`Successfully processed ${resource.name}`);
	} catch (error) {
		log.error(
			`Unable to process ${resource.name} - Error: ${error.message}`
		);
		__global.FAILURES.push(resourceName);
	}
	return {
		name: resource.name,
		schema: result,
	};
};

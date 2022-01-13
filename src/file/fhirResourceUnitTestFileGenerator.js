const fs = require('fs').promises;
const path = require('path');
const log = require('../utils/logging');
const breakString = require('../utils/generatorUtils').breakString;
const getExamples = require('../fetcher/fhirExampleFetcher').getExamples;
const config = require('config');
const RESOURCES_DIR = config.output.dir.resource;

const callback = (error) => {
	if (error) {
		throw error;
	}
};

module.exports = {
	buildUnitTestFiles: async (resources) => {
		let fetchedResources = await getExamples(resources);

		for (let resource of fetchedResources) {
			await generateUnitTestFile(resource);
		}
	},
};

const generateUnitTestFile = async (resource) => {
	let resourceName = resource.name,
		obj = JSON.parse(resource.schema),
		functionParameters = {},
		expects = '',
		filename = `${resourceName}Resource.test` || '__failed';

	for (let field of Object.keys(obj)) {
		if (typeof obj[field] === 'string') {
			expects += `expect(resource['${field}']).toEqual(\`${obj[field]}\`);`;
		} else if (
			obj[field] instanceof Array &&
			typeof obj[field][0] === 'string'
		) {
			expects += `expect(resource[${field}][0]).toEqual(\`${obj[field][0]}\`);`;
		} else if (!(obj[field] instanceof Array)) {
			expects += `expect(JSON.stringify(resource['${field}']).replace(/\\s\\t\\r\\n/g, '"')).toEqual(\`${JSON.stringify(
				obj[field]
			).replace(/\\s\\t\\r\\n/g, '"')}\`);`;
		}
	}
	let writeToFile = `
import ${resourceName}Resource from './${resourceName}Resource'
const fhirData =
${JSON.stringify(obj, null, 4)}

describe('${resourceName}Resource', () => {
it('should map fields properly', () => {
	let resource = new ${resourceName}Resource(fhirData);
	${expects}
});

it('should generate the correct fhir respresentation', () => {
	let resource = new ${resourceName}Resource();
	expect(resource.fhir.replace(/\\s\\r\\t\\n/g, '')).toEqual(fhirData.replace(/\\s\\r\\t\\n/g, ''));
})
});
`;
	try {
		let file = path.resolve(RESOURCES_DIR, `${filename}.js`);
		log.info(`File: ${file}`);
		await fs.writeFile(file, writeToFile, { flag: 'w' }, callback);
		log.success(`Successfully wrote file ${filename}.js`);
	} catch (error) {
		log.error(
			`Failed to write file ${filename}.js - Error: ${error.message}`
		);
		FAILURES.push(filename);
	}
};

const fs = require('fs').promises;
const path = require('path');
const log = require('../utils/logging');
const breakString = require('../utils/generatorUtils').breakString;
const getExamples = require('../fetcher/fhirExampleFetcher').getExamples;
const config = require('config');

const callback = (error) => {
	if (error) {
		throw error;
	}
};

const generateUnitTestFileInner = async (resource, fields) => {
	let resourceName = resource.name,
		obj = JSON.parse(resource.schema),
		functionParameters = {},
		expects = '',
		filename = `${resourceName}Resource.test` || '__failed';

	for (let fieldRaw of fields) {
		let field = fieldRaw.split('=')[0].trimEnd(),
			value;
		if (field !== 'text') {
			if (!obj[field]) {
				let splitFields = field.split('_');
				if (
					splitFields.length >= 2 &&
					obj[splitFields[0]][splitFields[1]]
				) {
					value = obj[splitFields[0]][splitFields[1]];
				}
			} else {
				value = obj[field];
			}

			let expect;

			if (value) {
				if (typeof value === 'string') {
					expect = `expect(resource['${field}']).toEqual(\`${value}\`);`;
				} else if (
					value instanceof Array &&
					typeof value[0] === 'string'
				) {
					expect = `expect(resource[${field}][0]).toEqual(\`${value[0]}\`);`;
				} else if (
					(value instanceof Array && typeof value[0] !== 'string') ||
					!(value instanceof Array)
				) {
					expect = `expect(JSON.stringify(resource['${field}']).replace(/\\s\\t\\r\\n/g, '"')).toEqual(\`${JSON.stringify(
						value
					).replace(/\\s\\t\\r\\n/g, '"')}\`);`;
				}

				expects += `try {
					${expect}
				} catch {
					errors.push('${field}')
				}`;
			}
		}
	}
	let writeToFile = `
import ${resourceName}Resource from './${resourceName}Resource'
const fhirData =
${JSON.stringify(obj, null, 4)}

describe('${resourceName}Resource', () => {
it('should map fields properly', () => {
	let resource = new ${resourceName}Resource(fhirData);
	let errors = new Array();
	${expects}

	expect(errors).toHaveLength(0);
});

//it('should generate the correct fhir respresentation', () => {
//	let resource = new ${resourceName}Resource();
//	expect(resource.fhir.replace(/\\s\\r\\t\\n/g, '')).toEqual(fhirData.replace(/\\s\\r\\t\\n/g, ''));
//})
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

module.exports = {
	buildUnitTestFiles: async (resources) => {
		let fetchedResources = await getExamples(resources);

		for (let resource of fetchedResources) {
			await generateUnitTestFileInner(resource);
		}
	},
	generateUnitTestFile: generateUnitTestFileInner,
};

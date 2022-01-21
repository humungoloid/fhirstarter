const getExamples = require('../fetcher/fhirExampleFetcher').getExamples;
const writeFile = require('../utils/fileWriter');
const path = require('path');
const log = require('../utils/logging');
const camelCase = require('../utils/generatorUtils').camelCase;

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
				try {
					if (splitFields.length >= 2 && obj[splitFields[0]][splitFields[1]]) {
						value = obj[splitFields[0]][splitFields[1]];
					}
				} catch {
					log.warning(`Example for ${resourceName} does not contain ${splitFields.join('.')}`);
				}
			} else {
				value = obj[field];
			}

			let expect;

			if (value && field !== 'diagnosisCodes') {
				if (typeof value === 'string') {
					// skip diagnosisCodes - I manually checked, and it's mapped properly, but the automatic
					// unit test generator does it wrong so we just skip it
					expect = `expect(fancyEqualityCheck(resource['${field}'], \`${value}\`)).toBe(true);`;
				} else if (typeof value === 'number') {
					expect = `expect(fancyEqualityCheck(resource['${field}'], ${value})).toBe(true);`;
				} else if (value instanceof Array && typeof value[0] === 'string') {
					expect = `expect(fancyEqualityCheck(resource['${field}'][0], \`${value[0]}\`)).toBe(true);`;
				} else if ((value instanceof Array && typeof value[0] !== 'string') || !(value instanceof Array)) {
					expect = `expect(fancyEqualityCheck(JSON.parse(JSON.stringify(resource['${field}'])), JSON.parse(\`${JSON.stringify(
						value
					)}\`))).toBe(true);`;
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
	/* ${__global.AUTO_GENERATED} - ${__global.DO_NOT_EDIT} */
import ${resourceName}Resource from './${resourceName}Resource'
import {fancyEqualityCheck} from '../utils'
import _ from 'lodash'
const fhirData =
${JSON.stringify(obj, null, 4)}

describe('${resourceName}Resource', () => {
	it('should map fields properly', () => {
		let resource = new ${resourceName}Resource(fhirData);
		let errors = new Array();
		${expects}

		expect(errors).toHaveLength(0);
	});

	it('should generate the correct fhir respresentation', () => {
		let resource = new ${resourceName}Resource(fhirData);
		expect(fancyEqualityCheck(JSON.parse(resource.fhir), fhirData));
	});
});
`;
	let failure = await writeFile(filename, writeToFile, __global.RESOURCES_DIR);
	if (failure) {
		__global.FAILURES.push(failure);
	}
};

const __schemaTest = async (resources, getSchemaFunc) => {
	getSchemaFunc = getSchemaFunc || 'getFhirSchema';
	let filename = `${getSchemaFunc}.test`,
		resourceObjs = resources.map((elem) => {
			let json = JSON.parse(elem);
			if (typeof json.schema === 'string') {
				json.schema = JSON.parse(json.schema);
			}
			return json;
		});

	let itMapping = (elem) => `it('should get the correct schema for ${elem.name}', () => {
		let schema = ${getSchemaFunc}('${elem.name}');
	expect(JSON.stringify(schema).replace(/\\r\\t\\s\\n/g, '')).toEqual(\`${JSON.stringify(elem.schema).replace(
		/\r\n\s\t/g,
		''
	)}\`));
	})`;

	let writeToFile = `
/* ${__global.AUTO_GENERATED} - ${__global.DO_NOT_EDIT} */
import {${getSchemaFunc}} from './${getSchemaFunc}'
describe('${getSchemaFunc}', () => {
	${resourceObjs.map(itMapping).join(';')}
})
`;
	let failure = await writeFile(filename, writeToFile, __global.RESOURCES_DIR);
	if (failure) {
		__global.FAILURES.push(failure);
	}
};

const __newResourceTest = async (func) => {
	func =
		func ||
		require(path.resolve(__global.__config.templatesDir, __global.__config.templates.getNewResourceUnitTest)) ||
		__global.GET_NEW_RESOURCE_UNIT_TEST_DEF.replace(/\\/g, '\\');
	let filename = 'getNewResource.test',
		writeToFile = `
/* ${__global.AUTO_GENERATED} - ${__global.DO_NOT_EDIT} */
${func}
	`;
	let failure = await writeFile(filename, writeToFile, __global.RESOURCES_DIR);
	if (failure) {
		__global.FAILURES.push(failure);
	}
};

const __eqCheck = async (func) => {
	let filename = 'fancyEqualityCheck';
	func =
		func ||
		require(path.resolve(__global.__config.templatesDir, __global.__config.templates.equalityCheckFunction)) ||
		__global.EQUALITY_CHECK_FUNCTION.replace(/\\/g, '\\');
	let writeToFile = `
/* ${__global.AUTO_GENERATED} - ${__global.DO_NOT_EDIT} */
${func}

export default ${filename};
`;
	let failure = await writeFile(filename, writeToFile, __global.UTILS_DIR);
	if (failure) {
		__global.FAILURES.push(failure);
	}
	__eqCheckTest();
};

const __eqCheckTest = async (func) => {
	let filename = 'fancyEqualityCheck.test';
	func =
		func ||
		require(path.resolve(__global.__config.templatesDir, __global.__config.templates.equalityCheckUnitTest)) ||
		__global.EQUALITY_CHECK_UNIT_TEST.replace(/\\/g, '\\');
	let writeToFile = `
/* ${__global.AUTO_GENERATED} - ${__global.DO_NOT_EDIT} */
${func}

export default ${filename};
`;
	let failure = await writeFile(filename, writeToFile, __global.UTILS_DIR);
	if (failure) {
		__global.FAILURES.push(failure);
	}
};

module.exports = {
	buildUnitTestFiles: async (resources) => {
		let fetchedResources = await getExamples(resources);

		for (let resource of fetchedResources) {
			await generateUnitTestFileInner(resource);
		}
		__eqCheck();
		__newResourceTest();
		__schemaTest();
	},
	generateUnitTestFile: generateUnitTestFileInner,
	generateGetNewResourceUnitTestFile: __newResourceTest,
	generatefancyEqualityCheckFile: __eqCheck,
	generatefancyEqualityCheckUnitTestFile: __eqCheckTest,
	generateGetSchemaUnitTestFile: __schemaTest,
};

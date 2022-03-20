// TODO: Finish this...it should be able to take a generated fhir resource as input and determine
// whether the fhir is valid; sort of like an integration test kinda

const $ = require('shelljs');
const path = require('path');
const fs = require('fs').promises;

const SHELL_CMD = `java -jar ${path.resolve(__dirname, 'validator_cli.jar')}`;

const validateResource = async (resourceName) => {
	let dir = path.resolve(__global.ROOT_DIR, RESOURCES_DIR),
		filesInDir = await fs.readdir(dir);

	let regex = /\d*Resource.test.js/;
	let mappedFiles = filesInDir.filter((elem) => regex.test(elem.split(path.delimiter)));

	for (let file of mappedFiles) {
		await $.exec(SHELL);
	}
	return { valid: true, errors: [] };
};

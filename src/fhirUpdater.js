const axios = require('axios');
const HTMLParser = require('node-html-parser');
const fs = require('fs').promises;

const path = require('path');

const maturities = path.resolve(__dirname, '../.fhirstarter/maturity.json');

const FHIR_BASE_URL = `https://www.hl7.org/fhir`;
//const MULTIVALUE_REGEX = /\[{(?<value>[^}\/]*)}]*,\s*\/\/\s*(?<comment>[^"]*)\\r\\n)/

const verbose = true;

const instance = axios.create({
	baseURL: FHIR_BASE_URL,
	timeout: 120000,
	headers: { 'X-Requested-With': 'XMLHttpRequest' },
	transformResponse: [(data) => data],
});

const readMaturities = () => {
	let fileContents, fileContentsJson;
	try {
		fileContents = await fs.readFile(maturities),
		fileContentsJson = JSON.parse(fileContents);
	}
	catch {
		console.log('Unable to read file contents, or the file contents are not properly formatted JSON.')
	}
}

const checkForUpdates = () => {
	let response = await instance.get('resourcelist.html');
	let data = HTMLParser.parse(response);
	let child = data.querySelector()
}
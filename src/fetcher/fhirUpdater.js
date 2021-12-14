const axios = require('axios');
const HTMLParser = require('node-html-parser');
const fs = require('fs').promises;
const log = require('./logging');
const path = require('path');
const config = require('config');

const maturities = path.resolve(__dirname, '../.fhirstarter/maturity.json');
const RESOURCE_LIST_PAGE = config.http.resourceList;

const readMaturities = () => {
	let fileContents, fileContentsJson;
	try {
		(fileContents = await fs.readFile(maturities)),
			(fileContentsJson = JSON.parse(fileContents));
	} catch {
		log.info(
			'Unable to read file contents, or the file contents are not properly formatted JSON.'
		);
	}
};

const checkForUpdates = () => {
	let response = await HTTP.get(RESOURCE_LIST_PAGE);
	let data = HTMLParser.parse(response);
	let child = data.querySelector();
};

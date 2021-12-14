const config = require('config');
const axios = require('axios');
module.exports = () => {
	global.VERBOSE = config.get('logging.level') === true;
	global.AUTO_GENERATED = config.headerComment;
	global.FAILURES = [];
	global.HTTP = axios.create({
		baseURL: config.http.baseUrl,
		timeout: config.http.timeoutMs,
		headers: { 'X-Requested-With': 'XMLHttpRequest' },
		transformResponse: [(data) => data],
	});
	global.config = config;
};

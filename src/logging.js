module.exports = {
	warning: (str) => {
		console.log('\x1b[33m%s\x1b[0m', `WARNING - ${str}`);
	},

	error: (str) => {
		console.log('\x1b[31m%s\x1b[0m', `ERROR - ${str}`);
	},

	success: (str) => {
		console.log('\x1b[32m%s\x1b[0m', `SUCCESS - ${str}`);
	},

	info: () => {
		console.log(str);
	}
}
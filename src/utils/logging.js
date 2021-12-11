const colours = require('./consoleColors');

module.exports = {
	warning: (str) => logWithColour(str, colours.fgYellow),

	error: (str) => logWithColour(str, colours.fgRed),

	success: (str) => logWithColour(str, colours.fgGreen),

	verbode: (str) => logWithColour(str, colours.fgBlue),

	info: (str) => logWithColour(str, colours.reset),
};

const logWithColour = (str, color) =>
	console.log(`${color}${str}${colours.reset}`);

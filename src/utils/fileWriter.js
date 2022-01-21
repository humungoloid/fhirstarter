const fs = require('fs').promises;
const path = require('path');
const log = require('../utils/logging');
const prettier = require('prettier');

const writeToFile = async (filename, fileContents, dir) => {
	if (dir !== __global.ROOT_DIR) {
		dir = path.resolve(__global.ROOT_DIR, dir);
	}
	try {
		if (__global.PRETTIFY) {
			fileContents = prettier.format(fileContents, { parser: 'babel', ...__global.PRETTY_CONFIG });
		}
	} catch {
		log.warning(
			`There was an issue with ${filename}; prettification failed, which probably means the generated javascript is invalid.`
		);
	}
	try {
		let file = path.resolve(dir, `${filename}.js`);
		log.info(`Writing file ${filename}.js`);
		await fs.writeFile(file, fileContents, { flag: 'w' }, (error) => {
			if (error) {
				throw error;
			}
		});
		log.success(`Successfully wrote file ${filename}.js`);
		__global.FILES_WRITTEN.push(file);
	} catch (error) {
		log.error(`Failed to write file ${filename}.js - Error: ${error.message}`);
		return file;
	}
	return '';
};

module.exports = writeToFile;

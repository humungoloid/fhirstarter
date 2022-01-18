const fs = require('fs').promises;
const path = require('path');
const log = require('../utils/logging');
const config = require('config');

const __mkDirs = async (resourcesDir, utilsDir, dataTypesDir, cleanDirs) => {
	const resources = resourcesDir || RESOURCES_DIR,
		utilities = utilsDir || UTILS_DIR,
		datatypes = dataTypesDir || DATATYPES_DIR,
		CLEAR_DIRECTORIES = cleanDirs || config.cleanupDirectories;
	let dirs = [resources, utilities, datatypes];
	log.info('Creating directories...');
	for (let dir of dirs) {
		try {
			let files = await fs.readdir(dir);
			if (CLEAR_DIRECTORIES) {
				log.warning(`Deleting files in ${dir}...`);
				for (let file of files) {
					fs.unlink(path.resolve(dir, file));
				}
			}
		} catch {
			try {
				log.info(
					`${dir} could not be read; assuming it doesn't exist, and creating it.`
				);
				fs.mkdir(dir, { recursive: true });
			} catch (error) {
				log.error(
					`Unable to create directory '${dir}' - error: ${error.message}`
				);
			}
		}
	}
	log.info('Finished creating directories');
};
module.exports = {
	cleanDirs: async () => {
		__mkDirs(null, null, null, true);
	},

	makeDirs: __mkDirs,

	camelCase: (...args) => {
		let result = '';
		if (
			args.filter((elem) => typeof elem === 'string').length !=
				args.length &&
			args[0] !== null
		) {
			throw new Error('All arguments must be strings');
		}
		for (let arg of args) {
			if (result === '') {
				if (arg === null) {
					continue;
				}
				result =
					result + `${arg.charAt(0).toLowerCase()}${arg.slice(1)}`;
			} else {
				result =
					result + `${arg.charAt(0).toUpperCase()}${arg.slice(1)}`;
			}
		}
		return result;
	},

	breakString: (str, limit) => {
		str = str.replace(/\s{2,}/g, '\n');
		let result = '';
		for (let i = 0, count = 0; i < str.length; i++) {
			if (str[i] === '\n') {
				count = 0;
				result += str[i];
			}
			if (count >= limit && str[i] === ' ') {
				count = 0;
				result += '\n';
			} else {
				count++;
				result += str[i];
			}
		}
		return result;
	},
};

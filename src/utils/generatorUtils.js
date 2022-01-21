const fs = require('fs').promises;
const path = require('path');
const log = require('../utils/logging');

const __prettify = async () => {};
const DIRS = Object.entries(__global.__config.output.dir)
	.map((elem) => elem[1])
	.sort();

const _mkDirs = async (doCleanDirs) => {
	doCleanDirs = doCleanDirs === undefined ? __global.__config.output.cleanupDirectories : doCleanDirs;

	if (doCleanDirs) {
		await _cleanDirs();
	}
	log.info('Creating directories...');
	for (let dir of DIRS.map((elem) => path.resolve(__global.ROOT_DIR, elem))) {
		try {
			await fs.readdir(dir);
		} catch {
			try {
				log.info(`${dir} could not be read; assuming it doesn't exist, and creating it.`);
				await fs.mkdir(dir, { recursive: true });
			} catch (error) {
				log.error(`Unable to create directory '${dir}' - error: ${error.message}`);
			}
		}
	}
	log.info('Finished creating directories');
};

const _cleanDirs = async () => {
	let now = new Date();
	let backupRoot = `${__global.ROOT_DIR}_BACKUP_${(now.toDateString() + now.toTimeString())
		.replace(/[\s:\(]+(?<match>[^$])|\)/g, '-$<match>')
		.replace(/[^$]?$/, '')}`;
	await fs.mkdir(backupRoot);
	for (let dir of DIRS) {
		let dirRes = path.resolve(__global.ROOT_DIR, dir);
		log.info(`Backing up ${dirRes}`);

		try {
			await fs.access(dirRes);
			await fs.cp(dirRes, path.resolve(backupRoot, dir), { recursive: true });
		} catch (error) {
			log.warning(`Unable to copy ${dirRes}`);
		}

		let files = await fs.readdir(dirRes);
		log.warning(`Deleting files in ${dir}...`);
		for (let file of files) {
			try {
				await fs.readdir(path.resolve(dirRes, file));
			} catch {
				try {
					fs.unlink(path.resolve(dirRes, file));
				} catch (error) {
					log.warning(`Unable to delete ${file}: ${error.message}`);
				}
			}
		}
		try {
			log.warning(`Deleting dir ${dir}`);
			fs.rmdir(dirRes);
		} catch (error) {
			log.warning(`Unable to delete dir ${dir}`);
		}
	}
};

module.exports = {
	cleanDirs: _cleanDirs,
	makeDirs: _mkDirs,
	camelCase: (...args) => {
		let result = '';
		if (args.filter((elem) => typeof elem === 'string').length != args.length && args[0] !== null) {
			throw new Error('All arguments must be strings');
		}
		for (let arg of args) {
			if (result === '') {
				if (arg === null) {
					continue;
				}
				result = result + `${arg.charAt(0).toLowerCase()}${arg.slice(1)}`;
			} else {
				result = result + `${arg.charAt(0).toUpperCase()}${arg.slice(1)}`;
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

const cleanDirs = require('../utils/generatorUtils').cleanDirs;

module.exports = async (args) => {
	for (let i = 0; i < args.length; i++) {
		if (!(args[i].startsWith('--') || args[i].startsWith('-'))) {
			continue;
		}
		let arg = args[i];
		if (args[i + 1] && !(args[i + 1].startsWith('--') || args[i + 1].startsWith('-'))) {
			arg = [arg, args[i + 1]];
		} else {
			arg = [arg];
		}
		switch (arg[0]) {
			case '--clean':
				cleanDirs();
				break;
			case '-o':
			case '--output':
				if (!arg[1]) {
					throw Error('Must specify root directory');
				}
				__global.ROOT_DIR = arg[1];
				break;
			case '-b':
			case '--fhirbase-dir':
				if (!arg[1]) {
					throw Error('Must specify fhir base directory');
				}
				__global.FHIRBASE_DIR = arg[1];
				break;
			case '-r':
			case '--resources-dir':
				if (!arg[1]) {
					throw Error('Must specify resources directory');
				}
				__global.RESOURCES_DIR = arg[1];
				break;
			case '-c':
			case '--column-mapping-dir':
				if (!arg[1]) {
					throw Error('Must specify column mapping directory');
				}
				__global.COLUMN_MAPPING_DIR = arg[1];
				break;
			case '-d':
			case '--datatypes-dir':
				if (!arg[1]) {
					throw Error('Must specify datatypes directory');
				}
				__global.DATATYPES_DIR = arg[1];
				break;
			case '-e':
			case '--extensions-dir':
				if (!arg[1]) {
					throw Error('Must specify extension directory');
				}
				__global.EXTENSION_DIR = arg[1];
				break;
			case '-t':
			case '--utils-dir':
				if (!arg[1]) {
					throw Error('Must specify utils directory');
				}
				__global.UTILS_DIR = arg[1];
				break;
			case '-u':
			case '--no-pretty':
				__global.PRETTIFY = false;
				break;
			default:
				break;
		}
	}
};

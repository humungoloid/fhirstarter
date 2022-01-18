const cleanDirs = require('../utils/generatorUtils').cleanDirs;

module.exports = async (args) => {
	for (let i = 0; i < args.length; i++) {
		if (!args[i].startsWith('--')) {
			continue;
		}
		let arg = args[i];
		if (args[i + 1] && !args[i + 1].startsWith('--')) {
			arg = arg.split(' ');
		} else {
			arg = [arg];
		}
		switch (arg[0]) {
			case '--clean':
				cleanDirs();
				break;
			case '--resourcesDir':
				if (!arg[1]) {
					throw Error('Must specify resources directory');
				}
				global.RESOURCES_DIR = arg[1];
				break;
			case '--datatypesDir':
				if (!arg[1]) {
					throw Error('Must specify resources directory');
				}
				global.DATATYPES_DIR = arg[1];
				break;
			case '--utilsDir':
				if (!arg[1]) {
					throw Error('Must specify resources directory');
				}
				global.UTILS_DIR = arg[1];
				break;
			default:
				break;
		}
	}
};

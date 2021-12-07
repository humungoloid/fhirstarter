const FhirJsonFetcher = require('./fhirJsonFetcher');
const { processResourceJson } = require('./fhirResourceSchemaGenerator');
const fs = require('fs').promises;
const path = require('path');

const outputDir = path.resolve(__dirname, '../output')

const buildIndex = (resources) => {
	return new Promise((resolve, reject)  => {
		let resourceList = '';
		let importAll = ''
		for (let json of resources) {
			let fhirResource = JSON.parse(json)['resourceType'];
			let importStatement = `import ${fhirResource} from './${fhirResource}';`;
			if (json) {
				importAll = importAll + importStatement;
				resourceList = resourceList + `${fhirResource},`;
			}
		}

		try {
			let exportStatement = `export { ${resourceList} };`;
			let writeToFile = `${importAll}${exportStatement}`;
			let file = `${outputDir}/index.js`;
			console.log(`File: ${file}`);
			fs.writeFile(file, writeToFile, callback)
				.then(resolve('done'));
		} catch {
			reject('failed in buildIndex')
		}
	});
}

const callback = (error) => {
	if (error) {
		throw error; 
	} else {
		resolve('success')
	};
}

const buildFile = (schema) => {
	return new Promise((resolve, reject) => {
		let json = JSON.parse(schema),
			resourceName = json && json['resourceType'];
		try {		
			let toWrite = `const RESOURCE_TYPE=${resourceName};class ${resourceName}Resource extends FhirResourceBase{constructor(resourceString) {super(resourceString);}jsonGenerator=()=>{};fhirGenerator=()=>{};schema=${JSON.stringify(schema).slice(1,-1).replace(/\\/g, '')}}`
			let file = `${outputDir}/${resourceName}.js`;
			console.log(`File: ${file}`);
			fs.writeFile(file, toWrite, callback)
				.then(resolve('done'));
		} catch {
			reject('failed in buildFile');
		}
	})
}

const buildDataTypeFile = (dataTypes) => {
	return new Promise((resolve, reject) => {
		try {
			let file = `${outputDir}/fhirDataTypes.js`;
			console.log(`File: ${file}`);
			let p1 = new Promise((resolve1, resolve2) => {
				fs.writeFile(file, dataTypes, callback).then(resolve1('done'));
			})
			p1.then(resolve('success'));
		}
		catch {
			reject('failed in buildDataTypeFile');
		}
	})
}

const buildFiles = (resources, dataTypePages) => {
		buildDataTypeFile(dataTypePages);
		buildIndex(resources);
		for (let resource of resources) {
			buildFile(resource);
		}
	};

module.exports = {
	buildFile: buildFile,
	buildFiles: buildFiles,
	buildIndex: buildIndex,
}
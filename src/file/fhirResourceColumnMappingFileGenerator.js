const writeFile = require('../utils/fileWriter');
const path = require('path');

let canEdit = true;
const MAPPING_FUNC_DEFAULT = __global.MAPPING_FUNCTION_IS_DEFAULT || true;
const DEFAULT_COLUMN_LIST_BUILDER_FUNCTION_NAME = 'buildColumnList';
/**
 * Uses regex to split a string at its capital letters, and replace the first lowercase letter
 * with its capitalized cousin. Essentially un-camelCases and sentence-ifies a string
 * ie thisIsATest => This Is A Test
 */
const generateLabel = (field) => {
	return (
		field
			// split the string at the capital letters
			.replace(/(?<charOne>[a-z0-9])(?<charTwo>[A-Z0-9])/g, '$<charOne> $<charTwo>')
			// capitalize the first letter of the first word
			.replace(/^(?<charOne>[a-z])/g, (char) => char.toUpperCase())
			// change 'num' to '#', just because
			.replace(/[nN]um(ber[s]?)/g, '#')
	);
};

const __mappingFuncFile = async (resources) => {
	if (resources.length === 0) {
		return 1;
	}
	let dict = new Array(),
		filename = 'getColumnMapping',
		imports = new Array();
	for (let name of resources.map((elem) => JSON.parse(elem).name)) {
		if (name) {
			dict.push(name);
			imports.push(name);
		}
	}

	let dictMapping = (elem) => `${elem}: ${elem}Mapping`;
	let importMapping = (elem) => `import ${elem}Mapping from './${elem}Mapping'`;
	const mappingFunctionName = 'getColumnMapping';
	const mappingFunc = `const ${mappingFunctionName} = (resource) => dict[resource] || dict.default`;
	const exportStmt = `export ${MAPPING_FUNC_DEFAULT ? 'default' : '{'} ${mappingFunctionName}${
		MAPPING_FUNC_DEFAULT ? '' : '}'
	}`;

	let importAll = `${imports.map(importMapping).join(';')}`,
		defineDict = `const dict = { ${dict.map(dictMapping).join(',')}, default: ImagingStudyWorklistMapping };`,
		writeToFile = `
/* ${__global.AUTO_GENERATED} - ${__global.DO_NOT_EDIT} */
${importAll}
${defineDict}
${mappingFunc}
${exportStmt}
`;
	let failure = await writeFile(filename, writeToFile, __global.COLUMN_MAPPING_DIR);
	if (failure) {
		__global.FAILURES.push(failure);
	}
	return {
		func: mappingFunctionName,
		file: filename,
	};
};

const __mappingIndexFile = async (...args) => {
	let arr = [...args];
	let filename = 'index',
		imports = arr.map((elem) => `import ${elem.func} from './${elem.file}'`),
		exportObjs = `export {${arr.map((elem) => elem.func).join(',')}}`,
		writeToFile = `
/* ${__global.AUTO_GENERATED} - ${__global.DO_NOT_EDIT} */
${imports.join(';')}
${exportObjs}
`;
	let failure = await writeFile(filename, writeToFile, __global.COLUMN_MAPPING_DIR);
	if (failure) {
		__global.FAILURES.push(failure);
	}
};

const __columnListBuilderFile = async (mappingFuncInfo) => {
	let columnBuilderFunction = DEFAULT_COLUMN_LIST_BUILDER_FUNCTION_NAME,
		filename = __global.DEFAULT_COLUMN_LIST_BUILDER_FUNCTION.functionName,
		writeToFile = `
/* ${__global.AUTO_GENERATED} - ${__global.DO_NOT_EDIT} */
${__global.DEFAULT_COLUMN_LIST_BUILDER_FUNCTION.imports}
const ${__global.DEFAULT_COLUMN_LIST_BUILDER_FUNCTION.functionName} = (${__global.DEFAULT_COLUMN_LIST_BUILDER_FUNCTION.args}) => 
${__global.DEFAULT_COLUMN_LIST_BUILDER_FUNCTION.function}
${__global.DEFAULT_COLUMN_LIST_BUILDER_FUNCTION.exports}
	`;
	let failure = await writeFile(filename, writeToFile, __global.COLUMN_MAPPING_DIR);
	if (failure) {
		__global.FAILURES.push(failure);
	}
	return {
		func: columnBuilderFunction,
		file: filename,
	};
};

module.exports = {
	/**
	 * Generates a file containing column mappings to be used in displaying data
	 * @param {string} resource The FHIR resource whose fields should be mapepd
	 * @param {string[]} fields The fields that will be mapped to columns
	 */
	generateColumnMappingFile: async (resource, fields) => {
		let customColumns = __global.CUSTOM_IMAGINGSTUDYWORKLIST_COLUMNS || {};
		fields = fields.map((elem) => elem.split('=')[0].trim());
		let filename = `${JSON.parse(resource).name}Mapping`,
			columnMapping = {};
		for (let field of fields) {
			let newField = JSON.parse(`{
				"label": "${generateLabel(field)}",
				"options": { "filter": "false", "sort": "false" },
				"queryParameter": "${field}",
				"valueSet": {},
				"filterType": "none",
				"getDisplay": "(resource)=>{ return resource.${field} }"
			}`);
			columnMapping[field] = newField;
		}

		const mappingObj =
			JSON.parse(resource).name === 'ImagingStudyWorklist'
				? JSON.stringify({ ...columnMapping, ...customColumns })
				: JSON.stringify(columnMapping);
		let writeToFile = `
		/* ${__global.AUTO_GENERATED} - ${__global.ALLOW_EDIT} */
import { fhirExtensionUrls } from '../../extension';
const ${filename} = ${mappingObj
			// remove quotes around prop names
			.replace(/"(?<prop>[^"]*)"\s*:\s*/g, '$<prop>: ')
			// remove quotes around true/false
			.replace(/"(true|false)"/g, '$1')
			// remove quotes around function
			.replace(/"\((?<args>[^\)]*)\)\s*=>\s*{(?<function>[^}]*)}"/g, '($<args>)=>{$<function>}')}
export default ${filename};
		`;

		let failure = await writeFile(filename, writeToFile, __global.COLUMN_MAPPING_DIR);
		if (failure) {
			__global.FAILURES.push(failure);
		}
	},

	/**
	 * Generates an index for the column mapping files
	 * @param {Object} param0 An object with two fields: functionName, functionFilename
	 */
	generateMappingFunctionFile: __mappingFuncFile,

	/**
	 * Generates a file containing a hash of FHIR resource names to column mapping objects, and a function
	 * for obtaining those mapping objects
	 * @param {string[]} resources
	 * @returns An object containing two properties: functionName and functionFilename. The functionName
	 * is the name of the mapping function generated and the functionFilename is the filename in which the
	 * function was written.
	 * These values are used to generate an index.
	 */
	generateColumnMappingIndex: __mappingIndexFile,
	generateColumnBuilderFunctionFile: __columnListBuilderFile,
	/**
	 * Generates a columnMapping function file and an index for the column mapping folder
	 * @param {string[]} resources An array of stringified JSON objects representing FHIR resources with their names
	 * and a description
	 */
	generateColumnMappingFiles: async (resources) => {
		let mapping = await __mappingFuncFile(resources);
		let builder = await __columnListBuilderFile(mapping);
		await __mappingIndexFile(mapping, builder);
	},
};

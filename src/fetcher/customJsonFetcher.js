/**
 * Used to get json from an Ext.js model
 */

const fs = require('fs').promises;
const log = require('../utils/logging');
const parse = require('parse-js');

let currentFile;

const __readExtJsFile = async (file) => {
	currentFile = file;
	let contents;
	try {
		contents = await fs.readFile(file, 'utf8');
	} catch (error) {
		log.warning(`Unable to read file: ${file}: ${error.message}`);
	}
	return contents;
};

const __stripExtJsClass = (fileContents) => {
	let regexed = fileContents
		.replace(/"/g, "'")
		// first remove any single line comments, like me
		.replace(/(?<!http:)\/\/\s*[^\r\n\t]*/gi, '')
		.replace(/^\s*\/\/.*$/g, '')
		// remove block comments at the beginning of the file, if any
		.replace(/\/\*\*([\s\S]*?)\*\//g, '')
		// uncomment any commented out sections; they were probably commented out of the
		// extjs file because they didn't work or they weren't needed, having them here
		// can't hurt
		.replace(/\/\*|\*\//g, '')
		// get rid of the call to Ext.define, up to the first curly brace aka our object we want
		.replace(/Ext.define[^\{]*/i, '')
		// strip off the ) that matched the opening one we just got rid of, as well as a semicolon if present
		.replace(/\);?(?![\s;\{\}\)\/,])/, '')
		.replace(/"/g, '\\"')
		// replace : in urn:oid or whatever with a squiggle so we can exclude it from double-quoting
		.replace(/(?<=urn[:0-9A-Za-z\s]*):(?=[\sa-zA-Z0-9:]*[ou]id[\)]*)/g, '~')
		// put double quotes around all prop names
		.replace(/(?<prop>[a-z0-9_]*):(?!\/\/)/gi, '"$<prop>":')
		// replace squiggles with colons again
		.replace(/~/g, ':')
		// replace single quotes with double quotes
		.replace(/'/g, '"')
		// remove all spaces
		.replace(/[\s]+/g, ' ') //;
		// put parentheses around the functions
		.replace(/(?<func>(function\s*\([^\)]*\)\s*|\([^\)]*\)\s*=>\s*)\{\s*.+?)\},(?!\{)/g, '"$<func>}"},')
		.replace(/(?<func>(function\s*\([^\)]*\)\s*|\([^\)]*\)\s*=>\s*)\{\s*.+?)\},(?=\{)/g, '"$<func>"},')
		// change any values with double quotes that are used as arguments to a function call to use single quotes
		.replace(/(\([a-zA-Z,\s.'"|]*)['"]([^'"]*)['"]([a-zA-Z\s0-9,.'|"]*\))/g, "$1'$2'$3")
		// if a ternary expression was used with an empty string, that will cause problems
		.replace(/"":/g, ':')
		// sets of double quotes will break our string
		.replace(/""/g, 'null')
		// there are expressions that replace urn:oid: with '', the trailing : causes problems
		.replace(/"([ou]?id)":/g, '$1:')
		// sometimes there are random commas
		.replace(/,(\s*})/g, '$1');

	let final;

	try {
		final = JSON.parse(regexed);
	} catch {
		regexed = regexed
			// remove everything after the fields value
			.replace(/("fields":\s*\[.*\]),\s*(?="[a-zA-Z0-9]*").*$/g, '$1}')
			// this is just to fix some weird behaviours encountered when wrapping functions
			.replace(/\}"\},/g, '}}",');
		final = JSON.parse(regexed);
	}
	return final.fields;
	// get rid of everything after fields
	// 		.replace(/(fields"?\s*:\s*\[([^\]]*)\]?)(?!.).*$/, '$1}')
	// ).fields;
};

const __extractFields = async (fileContents) => {
	const noNeed = [
		'resourceType',
		'text',
		'contained',
		'extension',
		'modifierExtension',
		'id',
		'meta',
		'implicitRules',
		'language',
	];
	const endings = [/^.*Display$/, /^.*Code$/, /^.*Object$/, /^.*Array$/];
	let readFields = __stripExtJsClass(fileContents),
		fields = new Array(),
		newMap = readFields.map((elem) => {
			let k = Object.keys(elem),
				newObjMap = new Map([]);
			for (let k1 of k) {
				if (k1 !== 'name') {
					newObjMap.set(k1, elem[k1]);
				}
			}
			return [elem.name, Object.fromEntries(newObjMap)];
		}),
		objToProcess = Object.fromEntries(newMap),
		keys = Object.keys(objToProcess);
	const addToFields = (value) => {
		if (fields.findIndex((elem) => elem.name === value.name) < 0) {
			fields.push(value);
		}
	};
	for (let key of keys) {
		if (
			// these fields are inherited from the base FhirResource and FhirDomainResource
			noNeed.includes(key) ||
			// these fields will all be in the extension or identifier arrays
			(objToProcess[key]['type'] && objToProcess[key]['type'] === 'fhirextension') ||
			// if we map to a subfield of an existing field, we don't need to include it
			(!!objToProcess[key]['mapping'] && keys.includes(objToProcess[key]['mapping'].split('.')[0])) ||
			// if Worklist 1.0 didn't persist a field, why should we?
			(!!objToProcess[key]['persist'] && objToProcess[key]['persist'] === false) ||
			// if the field is auto type and references some other extension or identifier field, we don't need it
			(!!objToProcess[`${key}Object`] &&
				!!objToProcess[`${key}Object`]['type'] &&
				objToProcess[`${key}Object`]['type'] === 'fhirextension') ||
			(!!objToProcess[key]['calculate'] && !!objToProcess[key]['calculate'].includes('return data.'))
		) {
			continue;
		} else if (key === 'patientBalance') {
			addToFields({ name: key, type: '__unsignedInt__' });
		} else if (key === 'encounter') {
			// special case
			addToFields({ name: key, type: '__Reference(Encounter)__' });
		} else if (key === 'modality') {
			// special case
			addToFields({ name: key, type: ['__Coding__'] });
		} else if (key === 'examDuration' || key === 'insuranceCopay') {
			// special cases
			addToFields({ name: key, type: '__unsignedInt__' });
		} else if (key === 'reasonCode') {
			addToFields({ name: key, type: ['__CodeableConcept__'] });
		} else if (!objToProcess[key]['type']) {
			// there's no type, so we try our best to handle it based on other model fields that may be present
			addToFields(__processTypeless(objToProcess, key));
		} else if (objToProcess[key]['type'] === 'fhiridentifier') {
			// we don't need the field itself, but we need an identifier array so that we have somewhere to put the data
			// when received
			addToFields({ name: 'identifier', type: ['__Identifier__'] });
		} else if (
			Object.keys(objToProcess[key]).length === 2 &&
			Object.keys(objToProcess[key]).includes('name') &&
			Object.keys(objToProcess[key]).includes('type')
		) {
			// very simple; just two fields, we can just use it
			addToFields({ name: key, type: __processTypeField(objToProcess[key][type]) });
		} else if (objToProcess[key]['type'] === 'fhirreference' && !!objToProcess[key]['referenceUrl']) {
			// a reference, simple enough
			addToFields({ name: key, type: `__Reference(${objToProcess[key]['referenceUrl']})__` });
		} else if (
			!!objToProcess[key]['mapping'] &&
			objToProcess[key]['mapping'].includes(`Common.utils.Date.toDateString(data.${key})`)
		) {
			// if our original model calls a function to convert the value to a datetime string, we must save the field as a datetime
			// obvious.
			addToFields({ name: key, type: __processTypeField('fhirdatetime') });
		} else if (
			!!objToProcess[key]['mapping'] &&
			objToProcess[key]['mapping'].split('.').length === 1 &&
			!(objToProcess[key]['mapping'].includes('function') || objToProcess[key]['mapping'].includes('=>')) &&
			!keys.includes(objToProcess[key]['mapping'])
		) {
			// this means that a field has a different name to the front end than the back; use the mapping value
			addToFields({ name: objToProcess[key]['mapping'], type: __processTypeField(objToProcess[key]['type']) });
		} else if (
			!!objToProcess[key]['mapping'] &&
			!(objToProcess[key]['mapping'].includes('function(') || objToProcess[key]['mapping'].includes('=>')) &&
			!keys.includes(objToProcess[key]['mapping'].split('.')[0].split('[')[0])
		) {
			if (
				!!objToProcess[key]['mapping'].split('.')[1] &&
				['code', 'display'].includes(objToProcess[key]['mapping'].split('.')[1])
			) {
				if (!!objToProcess[key]['mapping'].split('.')[0].split('[')[1]) {
					addToFields({
						name: objToProcess[key]['mapping'].split('.')[0].split('[')[0],
						type: ['__Coding__'],
					});
				} else {
					addToFields({ name: objToProcess[key]['mapping'].split('.')[0].split('[')[0], type: '__Coding__' });
				}
			} else {
				// the mapping value's root is a field that we don't have, so we create it
				addToFields({ name: objToProcess[key]['mapping'].split('.')[0].split('[')[0], type: '__Reference__' });
			}
		} else if (objToProcess[key]['type'] === 'auto' && key === 'basedOn') {
			// because I said so
			addToFields({ name: key, type: ['__Reference__'] });
		} else if (!!objToProcess[key]['convert'] && objToProcess[key]['convert'].includes('data.')) {
			// here we have a conversion function... basically the convert function will map something to data.<whatever>
			// so we can find out the whatever and map it ourselves if need be
			// if the convert function calls 'convertArrayToString', we know that there can be an array; otherwise, we use a single value
			let split = objToProcess[key]['convert'].split('.'),
				match = /^.*data$/,
				foundIdx = split.findIndex((elem) => match.test(elem)),
				fieldName;
			if (foundIdx >= 0 && split.length >= foundIdx + 2) {
				fieldName = split[foundIdx + 1].replace(/([a-zA-Z0-9]*).*$/, '$1');
				let typeValue;
				if (objToProcess[key]['convert'].includes('convertArrayToString')) {
					typeValue = __processTypeless(objToProcess, key).type;
					addToFields({ name: fieldName, type: [typeValue] });
				} else {
					typeValue = __processTypeless(objToProcess, key).type;
					addToFields({ name: fieldName, type: typeValue });
				}
			}
		} else if (endings.findIndex((elem) => elem.test(key)) >= 0 && key !== 'procedureCode') {
			// this is at the end because we want to run through everything else, since we may need the Display/Code/Array/Object fields for other stuff
			continue;
		} else {
			// anything else
			addToFields({ name: key, type: __processTypeField(objToProcess[key]['type']) });
		}
	}
	return [
		fields.sort(function (a, b) {
			return a.name.localeCompare(b.name);
		}),
		objToProcess['resourceType'].defaultValue,
	];
};

const __processTypeField = (value) => {
	let returnValue;
	switch (value) {
		case 'string':
			returnValue = '__string__';
			break;
		case 'fhirdatetime':
			returnValue = '__dateTime__';
			break;
		case 'fhirreference':
			let refUrls =
				(value.split('(')[1] &&
					value
						.split('(')[1]
						.split('|')
						.map((elem) => `${elem.charAt(0).toUpperCase()}${elem.slice(1)}`)
						.join('|')) ||
				'';
			returnValue = `__Reference${refUrls ? '(' : ''}${refUrls}${refUrls ? ')' : ''}__`;
			break;
		case 'number':
		case 'integer':
			returnValue = '__unsignedInt__';
			break;
		case 'fhircodeableconceptarray':
			returnValue = ['__CodeableConcept__'];
			break;
		case 'fhircodingarray':
			returnValue = ['__Coding__'];
			break;
		default:
			returnValue = '__string__';
			break;
	}
	return returnValue;
};

const __processTypeless = (obj, key) => {
	let type;
	if (!!obj[`${key}Display`] || !!obj[`${key}Code`]) {
		// if either of these fields exist, it means that the field we're looking at should contain a Coding value
		let currentProp = !!obj[`${key}Display`] ? obj[`${key}Display`] : obj[`${key}Code`];
		// if therer is a mapping function, and it calls converArrayToString(), we know that we need to support an array
		// ortherwise use a single value
		if (
			(!!currentProp['mapping'] && currentProp['mapping'].includes('convertArrayToString')) ||
			(!!currentProp['calculate'] && currentProp['calculate'].includes('convertArrayToString'))
		) {
			type = ['__Coding__'];
		} else {
			type = '__Coding__';
		}
	} else if (!!obj[key]['convert']) {
		let regex = /\s*(?<elem>[a-z0-9]*)\s*=>\s*\k<elem>.(?<prop>[a-z0-9]*)/gi,
			regexed = regex.exec(obj[key]['convert']),
			prop = regexed.length > 0 ? regexed.groups.prop : '';
		switch (prop) {
			case 'coding':
				type = '__CodeableConcept__';
				break;
			case 'code':
				type = '__Code__';
				break;
			default:
				type = '__string__';
		}
	} else {
		type = '__string__';
	}
	return { name: key, type: type };
};

const __generateSchema = (fields, resourceType) => {
	if (!resourceType || fields.length <= 0) {
		log.warning(`Unable to process ${currentFile}; could not find resourceType field.`);
		return;
	}
	let newObj = Object.fromEntries(fields.map((elem) => [elem.name, elem.type]));
	return {
		name: resourceType,
		reference: 'N/A',
		description: 'Proprietary RamSoft resource',
		schema: JSON.stringify(newObj).replace(/[\r\s\t\n]/g, ''),
	};
};

const __customResources = async (customResourceFilenames) => {
	if (customResourceFilenames.length === 0) {
		return [];
	}

	let resourceSchemas = new Array();
	for (let resourceFile of customResourceFilenames) {
		await __readExtJsFile(resourceFile)
			.then((contents) => __extractFields(contents))
			.then(([fields, resourceType]) => __generateSchema(fields, resourceType))
			.then((schema) => resourceSchemas.push(schema));
	}
	return resourceSchemas;
};

module.exports = __customResources;

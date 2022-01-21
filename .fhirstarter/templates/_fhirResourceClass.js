module.exports = `import { buildDataType, validatePrimitive } from '../utils';
import { getPrimitive, getSchema, isPrimitive } from '../datatypes';
import { getColumnMapping } from '../resource/columnMapping';
import _ from 'lodash';

export default class FhirResource {
	resourceType;
	json;

	rawData;

	id;
	meta;
	implicitRules;
	language;

	schema;

	#__fhir;
	#__saved = false;
	#__new = true;
	/**
	 * Creates a new instance of the fhir resource
	 * @param {string} resourceData - Either A string in JSON format, obtained from a fhir server, or a JSON object with field data
	 */
	constructor(resourceData, schema) {
		this.schema = { ...resourceSchema, ...schema };
		if (resourceData instanceof Object) {
			this.rawData = resourceData.resource ?? resourceData;
		} else {
			this.rawData = JSON.parse(resourceData.resource ?? resourceData);
		}
	}

	get saved() {
		return this.#__saved;
	}

	set saved(value) {
		this.#__saved = value;
	}

	get new() {
		return this.#__new;
	}

	set new(value) {
		this.#__new = value;
	}

	get fhir() {
		return this.#__generateFhir();
	}

	getColumnMapping = () => {
		return getColumnMapping(this.resourceType);
	};

	populateFields = () => {
		this.populateFieldsInner(this.schema, '');
	};

	handleDefaultValue = () => {};

	/**
	 *
	 * @param {object} schema the schema object use in processing
	 * @param {*} rootName the name of the value at the root of processing
	 */
	populateFieldsInner = (schema, rootName) => {
		let keys = Object.keys(schema);
		for (let key of keys) {
			let fieldName = this.buildFieldName(
				rootName,
				rootName === '' ? '' : '_',
				key
			);
			let fieldNames = fieldName.split('_');
			let rawDataValue = this.rawData;
			for (let i = 0; i < fieldNames.length; i++) {
				rawDataValue = rawDataValue[fieldNames[i]];
			}

			// resourceType is handled automatically, and theres nothing we can do if we don't have a value...so we continue
			if (!rawDataValue || key === 'resourceType') {
				continue;
			}
			if (schema[key] instanceof Array) {
				if (key === 'extension') {
					for (let v of rawDataValue) {
						// if the array is empty, a push will result in an array like [{}, {actual object}]
						this[fieldName].length === 0
							? // so if it IS empty, we assign the array-ified value to the field
							  (this[fieldName] = [v])
							: // otherwise just push
							  this[fieldName].push(v);
					}
				} else if (typeof schema[key][0] === 'string') {
					// some of our data may be malformed; we can take our best guess and return something that
					// is probably usable, but the behaviour here is, for now, indeterminate
					if (typeof rawDataValue === 'string') {
						rawDataValue = this.coerceValue(
							schema[key],
							rawDataValue
						);
					}

					if (rawDataValue.length > 0) {
						for (let v of rawDataValue) {
							// if the array is empty, a push will result in an array like ['', 'actual string']
							!!this[fieldName] && this[fieldName].length === 0
								? // so if it IS empty, we assign the array-ified value to the field
								  (this[fieldName] = [
										this.processNewValue(schema[key][0], v),
								  ])
								: // otherwise just push
								  this[fieldName].push(
										this.processNewValue(schema[key][0], v)
								  );
						}
					}
				} else {
					// if the array is empty, a push will result in an array like [{}, {actual object}]
					if (
						this[fieldName].length === 0 ||
						(this[fieldName].length === 1 &&
							JSON.stringify(this[fieldName][0]) ===
								JSON.stringify({}))
					) {
						if (rawDataValue instanceof Array) {
							this[fieldName] = JSON.parse(
								JSON.stringify(rawDataValue)
							);
						} else {
							this[fieldName] = [
								JSON.parse(JSON.stringify(rawDataValue)),
							];
						}
					} else {
						this[fieldName].push(
							JSON.parse(JSON.stringify(rawDataValue))
						);
					}
				}
			} else if (typeof schema[key] === 'string') {
				// simple case where the field is a regular type, just assign the value to the field
				this[fieldName] = this.processNewValue(
					schema[key],
					rawDataValue
				);
			} else {
				// here we have an object, and the fields are going to be based on the structure of the object
				// with underscores (_) indicating a descendent
				this.populateFieldsInner(schema[key], key);
			}
		}
	};

	coerceValue = (schemaKey, value) => {
		let schema = getSchema(
			schemaKey instanceof Array ? schemaKey[0] : schemaKey
		);

		let key = ['display', 'text', 'value', 'code'].find((elem) =>
			Object.keys(schema).includes(elem)
		);
		let returnValues = new Array();

		if (key) {
			if (value instanceof Array) {
				for (let val of value) {
					returnValues.push(
						Object.fromEntries(new Map([[key, val]]))
					);
				}
			} else {
				returnValues = [Object.fromEntries(new Map([[key, value]]))];
			}
		}

		return returnValues;
	};

	processNewValue = (valueType, value) => {
		let valueTypeTrimmed = valueType.split('(')[0].replace(/_/g, '');
		if (
			isPrimitive(valueTypeTrimmed) &&
			validatePrimitive(valueTypeTrimmed, value)
		) {
			// if it's a primitive and it's valid, we don't have to do anything but return the value
			return value;
		} else if (isPrimitive(valueTypeTrimmed)) {
			try {
				let prim = getPrimitive(valueTypeTrimmed);
				switch (prim.type) {
					case 'number':
						let num = _.toNumber(value);
						if (
							!(_.isNaN(num) || _.isNil(num)) &&
							validatePrimitive(valueTypeTrimmed, num)
						) {
							return num;
						} else {
							return prim.default || 0;
						}
					case 'string':
						let str = _.toString(value);
						if (
							!_.isNil(str) &&
							validatePrimitive(valueTypeTrimmed, str)
						) {
							return str;
						} else {
							return prim.default || '';
						}
					default:
						return prim.default || '';
				}
			} catch (error) {
				return;
			}
		} else if (!isPrimitive(valueTypeTrimmed)) {
			// here the value is not a primitive, so we create a new object adhering to the schema
			// of the datatype, while simultaneuously validating the data
			if (valueTypeTrimmed === 'Extension' && typeof value === 'string') {
				// this is a special case of extensions where the value provided is JUST a string
				// in this case we have to create a new object with some made up URL; if the value is a
				// valid extension, none of this is necessary
				// extensions are a pain because the value can be one of 50 different types
				let extensionValueType = valueType
					// we get the type (ie valueCoding, valueString, valueAge, etc)...
					.split('(')[1]
					.slice(0, valueType.split('(')[1].indexOf(')'));
				// ...and then create a new object containing the URL and the value
				value = Object.fromEntries(
					new Map([
						[extensionValueType, value],
						['url', 'http://ramsoft.com/hl7/extension'],
					])
				);
			}
			if (valueTypeTrimmed === 'Resource') {
				return value;
			}
			// once all the extension business is sorted out, we can get the builder function and create a new value
			return buildDataType(valueTypeTrimmed, value);
		}
	};

	buildFieldName = (...args) => {
		return [...args].reduce((a, b) => \`$\{a}\${b}\`);
	};

	buildFieldNameWithUnderscores = (...args) => {
		let str = '';
		for (let a of args) {
			if (str !== '') {
				str += '_';
			}
			str += a;
		}
		return str;
	};

	#__generateFhir = () => {
		let finalObj = this.#__createObjectForFhir(Object.keys(this), ''),
			finalStr;
		try {
			finalStr = JSON.stringify(finalObj);
		} catch (error) {
			console.error(\`Unable to generate FHIR resource: \${error.message}\`);
			throw error;
		}
		return finalStr;
	};

	#__createObjectForFhir = (fields, root) => {
		let map = new Map([]);
		let filtered = ((scope) =>
			_.filter(
				fields,
				(key, idx, arr) =>
					!_.includes(['json', 'rawData', 'schema'], key) &&
					!(scope[key] instanceof Function)
			))(this);

		let groups = _.groupBy(filtered, (elem) => _.head(_.split(elem, '_')));

		for (let key of _.keys(groups)) {
			let current = groups[key],
				currentName = this.buildFieldNameWithUnderscores(
					root,
					_.head(current)
				),
				currentValue = this[currentName];
			if (
				_.isNil(currentValue) ||
				(_.isArray(currentValue) && _.isEmpty(currentValue))
			) {
				continue;
			} else if (
				current.length === 1 &&
				// empty arrays are not allowed
				((this[currentName] instanceof Array &&
					this[currentName].length !== 0) ||
					!(this[currentName] instanceof Array))
			) {
				if (_.includes(_.keys(currentValue), 'div')) {
					// generate valid html by replacing escaped characters

					currentValue.div = _.replace(
						currentValue.div,
						/(quot|&(apos|lt|gt));/g,
						(match) => {
							switch (_.replace(match, /[&;]/g, '')) {
								case 'quot':
									return '\\"';
								case 'apos':
									return "'";
								case 'lt':
									return '<';
								case 'gt':
									return '>';
								default:
									return '';
							}
						}
					);
				}
				map.set(
					current[0],
					// if the value is an object but NOT an array (ie also not a string, number, etc)
					typeof currentValue === 'object' &&
						!(currentValue instanceof Array)
						? // not allowed underscored field names, also filter out undefined values
						  _.pickBy(
								currentValue,
								(v, k) =>
									!(
										_.isEmpty(v) ||
										_.isNil(v) ||
										_.startsWith(k, '__')
									)
						  )
						: // check if all the elements are objects/not arrays
						_.every(
								currentValue,
								(elem) =>
									typeof currentValue === 'object' &&
									!(this[elem] instanceof Array)
						  )
						? this.schema[current] instanceof Array &&
						  this.schema[current][0] === '__string__'
							? currentValue
							: // if we have a bunch of objects, filter out underscored field names and undefined
							  _.map(currentValue, (elem) =>
									_.pickBy(
										elem,
										(v, k) =>
											!(
												_.isNil(v) ||
												_.startsWith(k, '__')
											)
									)
							  )
						: // if all else fails, just use whatever is there
						  currentValue
				);
			} else if (current.length >= 2) {
				map.set(
					key,
					this.#__createObjectForFhir(
						_.map(current, (elem) => _.split(elem, '_')[1]),
						key
					)
				);
			} else {
				continue;
			}
		}
		return Object.fromEntries(map);
	};
}

const resourceSchema = {
	id: '__id__',
	meta: '__Meta__',
	implicitRules: '__url__',
	language: '__code__',
};

`
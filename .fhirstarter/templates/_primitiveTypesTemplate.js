/**
 * Remember to escape backslashes :)
 */

module.exports = `
const INTEGER_REGEX = /[0]|[-+]?[1-9]\\d*/;
const STRING_REGEX = /[ \\r\\n\\t\\S]+/;
const DECIMAL_REGEX = /-?(0|[1-9]\\d*)(\\.\\d+)?([eE][+-]?\\d+)?/;
const BASE64BINARY_REGEX = /(\\s*([0-9a-zA-Z\\+\\=]){4}\\s*)+/;
const INSTANT_REGEX =
	/(\\d(\\d(\\d[1-9]|[1-9]0)|[1-9]00)|[1-9]000)-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\\d|3[0-1])T([01]\\d|2[0-3]):[0-5]\\d:([0-5]\\d|60)(\\.\\d+)?(Z|(\\+|-)((0\\d|1[0-3]):[0-5]\\d|14:00))/;
const DATE_REGEX =
	/(\\d(\\d(\\d[1-9]|[1-9]0)|[1-9]00)|[1-9]000)(-(0[1-9]|1[0-2])(-(0[1-9]|[1-2]\\d|3[0-1]))?)?/;
const DATETIME_REGEX =
	/(\\d(\\d(\\d[1-9]|[1-9]0)|[1-9]00)|[1-9]000)(-(0[1-9]|1[0-2])(-(0[1-9]|[1-2]\\d|3[0-1])(T([01]\\d|2[0-3]):[0-5]\\d:([0-5]\\d|60)(\\.\\d+)?(Z|(\\+|-)((0\\d|1[0-3]):[0-5]\\d|14:00)))?)?)?/;
const TIME_REGEX = /([01]\\d|2[0-3]):[0-5]\\d:([0-5]\\d|60)(\\.\\d+)?/;
const CODE_REGEX = /[^\\s]+(\\s[^\\s]+)*/;
const OID_REGEX = /urn:oid:[0-2](\\.(0|[1-9]\\d*))+/;
const ID_REGEX = /[A-Za-z0-9\\-\\.]{1,64}/;
const MARKDOWN_REGEX = /\\s*(\\S|\\s)*/;
const UNSIGNEDINT_REGEX = /[0]|([1-9]\\d*)/;
const POSITIVEINT_REGEX = /\\+?[1-9]\\d*/;

const primitiveTypes = (() => {
	let types = {
		boolean: {
			type: 'boolean',
			values: [true, false],
			validator: (val) => val instanceof boolean,
		},
		integer: {
			type: 'number',
			range: { min: -2147483648, max: 2147483647 },
			regex: INTEGER_REGEX,
		},
		string: { type: 'string', regex: STRING_REGEX },
		decimal: {
			type: 'number',
			range: { min: Number.MIN_VALUE, max: Number.MAX_VALUE },
			regex: DECIMAL_REGEX,
			validator: (val) =>
				val !== Number.POSITIVE_INFINITY &&
				val !== Number.NEGATIVE_INFINITY &&
				!Number.isNaN(val),
		},
		uri: { type: 'string', regex: /\S*/ },
		url: { type: 'string' },
		canonical: { type: 'string' },
		base64Binary: { type: 'string', regex: BASE64BINARY_REGEX },
		instant: {
			type: 'string',
			regex: INSTANT_REGEX,
		},
		date: {
			type: 'string',
			regex: DATE_REGEX,
		},
		dateTime: {
			type: 'string',
			regex: DATETIME_REGEX,
		},
		time: {
			type: 'string',
			regex: TIME_REGEX,
		},
		code: { type: 'string', regex: CODE_REGEX },
		oid: { type: 'string', regex: OID_REGEX },
		id: { type: 'string', regex: ID_REGEX },
		markdown: { type: 'string', regex: MARKDOWN_REGEX },
		unsignedInt: {
			type: 'number',
			range: { min: 0, max: 2147483647 },
			regex: UNSIGNEDINT_REGEX,
		},
		positiveInt: {
			type: 'number',
			range: { min: 1, max: 2147483647 },
			regex: POSITIVEINT_REGEX,
		},
		uuid: { type: 'string' },
	};
	for (let key of Object.keys(types)) {
		if (types[key]) {
			if (!types[key].validator) {
				types[key].validator = () => true;
			}
			if (!types[key].regex) {
				types[key].regex = { test: () => true };
			}
		}
	}
	return types;
})();
export default primitiveTypes;
export const isPrimitive = (valueType) =>
	primitiveTypes[valueType] !== undefined;
`;
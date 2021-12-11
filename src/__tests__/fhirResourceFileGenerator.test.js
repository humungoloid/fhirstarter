const { intersects } = require('prettier');
const generateFields =
	require('../file/fhirResourceFileGenerator').generateFields;

const schema = {
	testString: '__value__',
	testArrayOfStrings: ['__value__'],
	testObject: {
		param: '__value__',
	},
	testArrayOfObjects: [
		{
			performer: [
				{
					function: '__CodeableConcept__',
				},
			],
		},
	],
};

const expectation = [
	'testString;',
	'testArrayOfStrings = [];',
	'testObject_param;',
	'series = [{}]',
];

describe('generateParameters', () => {
	it('should work', () => {
		let result = generateFields(schema);
		for (let r of expectation) {
			expect(result.includes(r)).toBeTruthy();
		}
	});
});

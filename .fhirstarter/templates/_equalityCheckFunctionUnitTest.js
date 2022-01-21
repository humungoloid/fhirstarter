module.exports = `import fancyEqualityCheck from './fancyEqualityCheck';

describe('fancyEqualityCheck', () => {
	it('should return true for arrays with the same objects in the same order', () => {
		let objOne = [1, 2, 3];
		let objTwo = [1, 2, 3];
		expect(fancyEqualityCheck(objOne, objTwo)).toBe(true);
	});
	it('should return true for arrays with the same objects in a different order', () => {
		let objOne = [1, 2, 3];
		let objTwo = [3, 1, 2];
		expect(fancyEqualityCheck(objOne, objTwo)).toBe(true);
	});
	it('should return false for arrays with different objects', () => {
		let objOne = [1, 2, 3];
		let objTwo = [4, 5, 6];
		expect(fancyEqualityCheck(objOne, objTwo)).toBe(false);
	});
	it('should return false for arrays with different lengths', () => {
		let objOne = [1, 2, 3];
		let objTwo = [1, 2, 3, 4];
		expect(fancyEqualityCheck(objOne, objTwo)).toBe(false);
	});
	it('should return true for objects with the same fields in the same order', () => {
		let objOne = { one: 'one', two: 'two' };
		let objTwo = { one: 'one', two: 'two' };
		expect(fancyEqualityCheck(objOne, objTwo)).toBe(true);
	});
	it('should return true for objects with the same fields in a different order', () => {
		let objOne = { one: 'one', two: 'two' };
		let objTwo = { two: 'two', one: 'one' };
		expect(fancyEqualityCheck(objOne, objTwo)).toBe(true);
	});
	it('should return true for objects with the same nested values', () => {
		let objOne = {
			one: {
				innerOne: 'innerOne',
				innerTwo: 'innerTwo',
				innerThree: {
					innerInnerOne: [4, 5, 6, 7],
					innerInnerTwo: 'innerInnerTwo',
				},
			},
			two: 'two',
			three: ['abc', 123],
		};
		let objTwo = {
			one: {
				innerThree: {
					innerInnerOne: [7, 6, 5, 4],
					innerInnerTwo: 'innerInnerTwo',
				},
				innerOne: 'innerOne',
				innerTwo: 'innerTwo',
			},
			three: [123, 'abc'],
			two: 'two',
		};
		expect(fancyEqualityCheck(objOne, objTwo)).toBe(true);
	});
	it('should return false for objects with different values', () => {
		let objOne = { one: 'one', two: 'two' };
		let objTwo = { two: 'three', one: 'four' };
		expect(fancyEqualityCheck(objOne, objTwo)).toBe(false);
	});
	it('should return false for objects with different sizes', () => {
		let objOne = { one: 'one', two: 'two' };
		let objTwo = { one: 'one', two: 'two', three: 'three' };
		expect(fancyEqualityCheck(objOne, objTwo)).toBe(false);
	});
	it('should return true for two of the same strings', () => {
		expect(fancyEqualityCheck('test', 'test')).toBe(true);
	});
	it('should return true for two of the same numbers', () => {
		expect(fancyEqualityCheck(666, 666)).toBe(true);
	});
	it('should return false for two different strings', () => {
		expect(fancyEqualityCheck('one', 'onetwo')).toBe(false);
	});
	it('should return false for two different numbers', () => {
		expect(fancyEqualityCheck(123, 456)).toBe(false);
	});
	it('should return false for two different value types', () => {
		expect(fancyEqualityCheck('123', 123)).toBe(false);
	});
});
`
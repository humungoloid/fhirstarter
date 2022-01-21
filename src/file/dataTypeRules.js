module.exports = {
	Attachment: ({ data, contentType }) => !data || !!contentType,
	Quantity: ({ code, system }) => !code || !!system,
	Age: ({ code, value, system }) =>
		(!!code || !value) &&
		(!system || system.toUpperCase() === 'UCUM') &&
		!!value &&
		value > 0,
	Count: ({ code, value, system }) =>
		(!!code || !value) &&
		(!system || system.toUpperCase() === 'UCUM') &&
		(!code || code === 1) &&
		(!value || !value.toString().includes('.')),
	Duration: ({ code, value, system }) =>
		code ? system.toUpperCase() === 'UCUM' && !!value : true,
	Range: ({ low, high }) => !!low || !!high || low <= high,
	Ratio: ({ numerator, denominator, extension }) =>
		((!numerator && !denominator) || (numerator && denominator)) &&
		(!!numerator || !!extension),
	Period: ({ start, end }) => !start || start < end,
	ContactPoint: ({ value, system }) => !value || !!system,
	Timing: ({
		duration,
		durationUnit,
		period,
		periodUnit,
		periodMax,
		durationMax,
		count,
		countMax,
		offset,
		when,
		timeOfDay,
	}) =>
		(!duration || !!durationUnit) &&
		(!period || !!periodUnit) &&
		(!!duration ? duration >= 0 : true) &&
		(!periodMax || !!period) &&
		(!durationMax || !!duration) &&
		(!countMax || !!count) &&
		(!offset || (!!when && !['C', 'CM', 'CD', 'CV'].includes(when))) &&
		(!timeOfDay || !when),
};

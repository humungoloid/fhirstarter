module.exports = {
	imports: `
import getColumnMapping from './getColumnMapping';
import _ from 'lodash';
import {
	MultiSelectFilter,
	SingleSelectFilter,
	TextSearchFilter,
	SuggestFilter,
} from '../../../../../ui/src/components/Grid/ColumnFilter';`,
	jsdoc: `/**
* @param  {Object} options
* @param  {Array} options.columns Required - a list of strings representing column names to be built into a list
* @param  {string} options.resource Required - the name of the FHIR resource whose mapping is to be used
* @param  {Function} options.suggest A React component to use for Suggest filtered columns
* @param  {Function} options.singleSelect A React component to use for Single-Select filtered columns
* @param  {Function} options.multiSelect A React component to use for Multi-Select filtered columns
* @param  {Function} options.textSearch A React component to use for Text Search filtered columns
* @param  {Function} options.dateTime A React component to use for DateTime filtered columns
*/`,
	functionName: 'buildColumnList',
	args: `{
		columns,
		resource,
		suggest,
		singleSelect,
		multiSelect,
		textSearch,
		dateTime,
	}`,
	function: `{
if (_.isEmpty(_.pickBy(columns, !_.isNil))) {
	throw new Error('columns must be provided to buildColumnList');
}
if (_.isEmpty(resource)) {
	throw new Error(
		'FHIR resource name must be provided to  buildColumnList'
	);
}
singleSelect = singleSelect ?? SingleSelectFilter;
multiSelect = multiSelect ?? MultiSelectFilter;
textSearch = textSearch ?? TextSearchFilter;
suggest = dateTime ?? SuggestFilter;

let columnMapping = getColumnMapping(resource);
let columnArray = new Array();
for (let column of columns) {
	let func;
	switch (columnMapping[column].filterType) {
		case 'suggest':
			func = suggest;
			break;
		case 'single-select':
			func = singleSelect;
			break;
		case 'multi-select':
			func = multiSelect;
			break;
		case 'text-search':
			func = textSearch;
			break;
		case 'date-time':
		// TODO: we have to implement this
		// func = dateTime;
		// break;
		default:
			break;
	}
	let opts =
		func && func.constructor === Function
			? {
					...columnMapping[column].options,
					customHeadLabelRender: func,
				}
			: columnMapping[column].options;
	let newColumn = {
		name: column,
		label: columnMapping[column].label,
		options: opts,
	};
	columnArray.push(newColumn);
}
return columnArray;`,
	exports: `
export default buildColumnList;`

} 
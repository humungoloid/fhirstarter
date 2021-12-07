const processJson = (jsonToProcess) => {
	const COMMENT_REGEX = /\/\/\s*[^"}]*(?<value>"|})/g;

	const OPEN_SQUARE_CURLY_BRACE = /\[{1}{(?<value>[A-Za-z])/g;
	const OPEN_CURLY_BRACE = /(?<first>[^\[]{1}){(?<value>[A-Za-z]?)/g;
	const OPEN_ANGLE_BRACKET = /(?<first>[^"]{1})<(?<value>[A-Za-z])/g;

	const CLOSE_SQUARE_CURLY_BRACE = /}],"/g;
	const CLOSE_CURLY_BRACE = /},"/g;
	const CLOSE_ANGLE_BRACKET = />,"/g;
	
	let newJson = jsonToProcess
		.replace(/\\n|\\t|\\r|\s|\r|\n|\t/g, '')
		.replace(COMMENT_REGEX, `$<value>`)
		.replace(/&lt;/g, '<').replace(/&gt;/g, '>')
		.replace(OPEN_SQUARE_CURLY_BRACE, '"[{$<value>')
		.replace(OPEN_CURLY_BRACE, '$<first>"{$<value>') 
		.replace(OPEN_ANGLE_BRACKET, '$<first>"<$<value>')
		.replace(CLOSE_SQUARE_CURLY_BRACE, '}]","')
		.replace(CLOSE_CURLY_BRACE, '}","')
		.replace(CLOSE_ANGLE_BRACKET, '>","')
		.replace(/:\[{($<value>[^"])/, ':"[{$<value>')
		.replace(/(?<value>[A-Za-z]*)}],/, '$<value>}]",')
		.replace(/:<($<value>[^"])/g, ':"<$<value>')
		.replace(/(?<value>[A-Za-z]*)>,/g, '$<value>>",')
		.replace(/:{($<value>[^"])/g, ':"{$<value>')
		.replace(/(?<value>[A-Za-z]*)},/g, '$<value>}",')
		.replace(/}}]"/g, '}"}]')
		.replace(/>}]"/g, '>"}]')
		.replace(/(?:"\[{)|(?:"{)|(?:"<)/g, '"')
		.replace(/(?<value>[A-Za-z)])(?:}]|}|>)"/g, '$<value>"');

	return JSON.parse(newJson);
}

module.exports.processDataTypeJson = processDataTypeJson;
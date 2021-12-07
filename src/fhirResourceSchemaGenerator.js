const processResourceJson = (jsonToProcess, resourceName) => {
	const COMMENT_REGEX = /\/\/\s*[^~]*~{2,}/g;

	// can a resource field could have two different types, it ordinarily would result in two double parentheses...we handle that with this beast:
	const HANDLE_OPTION_REGEX = /,"(?<prop1>[A-Za-z0-9]*)":"(?<value1>[A-Za-z0-9_]*)""(?<prop2>[A-Za-z0-9]*)":"(?<value2>[<>A-Za-z0-9_]*)"/g
	const HANDLE_OPTION_REPLACEMENT_STRING = ',"_or_$<prop1>":"$<value1>", "_or_$<prop2>":"<value1>"'

	let newJson = jsonToProcess
		.replace(/\r|\n/g, '~')
		.replace(COMMENT_REGEX, ``)
		.replace(/~/g, '')
		.replace(/~|\s|\r|\n|\t/g, '')
		.replace(/&lt;/g, '<').replace(/&gt;/g, '>')
		.replace(/>""/g, '>","')
		.replace(/}"/g, '},"')
		.replace(/{(?<value>[A-Za-z0-9()|.]+)}/g, '"__$<value>__"')
		.replace(/"?<(?<value>[A-Za-z0-9()|.]+)>"?/g, '"__$<value>__"')
		.replace(/__"(?<value>[^,\]}])/g, '__","$<value>')
		.replace(/",[A-Za-z0-9(),.:]*(?:Oneofthese)+\d:/, '",')
		.replace(HANDLE_OPTION_REGEX, HANDLE_OPTION_REPLACEMENT_STRING)

	return JSON.parse(newJson);
}

module.exports.processResourceJson = processResourceJson;
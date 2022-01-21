module.exports = {
	accessionNumber: {
		label: 'Accession #',
		getDisplay: "(resource) => {return resource.accessionNumber}",
	},
	modality: {
		label: 'Modality',
		filterType: 'multi-select',
		getDisplay: "(resource) => {return resource.modality.map((elem) => elem.code).join(' | ')}",
	},
	patientName: {
		label: 'Patient Name',
		getDisplay: "(resource) => {return resource.subject.display}",
	},
	managingOrganization: {
		label: 'Managing Organization',
		options: { filter: true, sort: true },
		filterType: 'suggest',
		getDisplay: "(resource) => {return resource.managingOrganization}",
	},
	studyStatus: {
		label: 'Study Status',
		getDisplay: "(resource) => {return resource.extension.find((elem) => elem.url === fhirExtensionUrls.common.studyStatus).valueCoding.display}",
	},
	studyDescription: {
		label: 'Study Description',
		getDisplay: "(resource) => {return resource.description}",
	},
}
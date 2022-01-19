const config = require('config');
const axios = require('axios');
module.exports = () => {
	global.VERBOSE = config.get('logging.level') === true;
	global.AUTO_GENERATED = config.headerComment;
	global.FAILURES = [];
	global.HTTP = axios.create({
		baseURL: config.http.baseUrl,
		timeout: config.http.timeoutMs,
		headers: { 'X-Requested-With': 'XMLHttpRequest' },
		transformResponse: [(data) => data],
	});
	global.RESOURCES_DIR = config.output.dir.resource;
	global.UTILS_DIR = config.output.dir.utils;
	global.DATATYPES_DIR = config.output.dir.datatypes;
	global.config = config;
	global.DEFAULT_ARG_VALIDATOR = require('../../.fhirstarter/templates/_argValidatorFunction');
	global.DEFAULT_PRIMITIVE_TYPES = require('../../.fhirstarter/templates/_primitiveTypesTemplate');
	global.IMAGING_STUDY_WORKLIST_SCHEMA = JSON.parse(`
	{
		"resourceType": "ImagingStudyWorklist",
		"id": "__string__",
		"internalStudyID": "__string__",
		"subject": "__Reference(Patient)__",
		"accessionNumber": "__Identifier__",
		"authorizationNumbers": "__string__",
		"assigningAuthority": "__Identifier__",
		"accountNumber": "__string__",
		"accountStatus": "__string__",
		"allergies": ["__Coding__"],
		"gender": "__string__",
		"availability": "__string__",
		"authorizationPeriod": "__string__",
		"cancellationReason": "__string__",
		"cdsId": "__Extension(valueString)__",
		"sourceDeviceAETitle": "__string__",
		"smokingStatus": [
			"__Coding__"
		],
		"conditions": [
			"__Coding__"
		],
		"languages": [
			"__Coding__"
		],
		"modality": [
			"__Coding__"
		],
		"race":[
			"__Coding__"
		],
		"ethnicity":[
			"__Coding__"
		],
		"patientEmail": "__string__",
		"transport": "__string__",
		"reasonCode": ["__CodeableConcept__"],
		"cellPhone": "__string__",
		"chargeStatus": "__string__",
		"patientContactMethod": "__string__",
		"customField1": "__Extension(valueString)__",
		"customField2": "__Extension(valueString)__",
		"customField3": "__string__",
		"customField4": "__string__",
		"customField5": "__string__",
		"customField6": "__string__",
		"dateTimeAddendum": "__dateTime__",
		"dateTimeOrdered": "__dateTime__",
		"dateTimeRead": "__dateTime__",
		"dateTimeReceived": "__dateTime__",
		"dateTimeSigned": "__dateTime__",
		"dateTimeTranscribed": "__dateTime__",
		"dateTimeVerified": "__dateTime__",
		"department": "__string__",
		"description": "__string__",
		"diagnosisCodes": [
			"__Coding__"
		],
		"examDuration": "__string__",
		"eligibility": "__Extension(valueCoding)__",
		"visitClass": "__string__",
		"communicationStatusName": "__string__",
		"fillerOrderNumber": "__string__",
		"homePhone": "__string__",
		"patientAge": "__unsignedInt__",
		"numImages": "__unsignedInt__",
		"insuranceCopay": "__decimal__",
		"objectType":"__string__",
		"reportingDetail": "__string__",
		"insuranceExpiry": "__dateTime__",
		"insurancePayer": "__Reference(Organization|Patient)__",
		"internalOrganizationId": "__string__",
		"internalOrganizationValue": "__string__",
		"insuranceStatus": "__string__",
		"examRoom": "__string__",
		"internalManagingOrganizationID": "__string__",
		"managingOrganization": "__string__",
		"patientLocation": "__string__",
		"modalityCode": "__string__",
		"numFrames": "__unsignedInt__",
		"numberOfInstances": "__unsignedInt__",
		"numReports": "__unsignedInt__",
		"numObjects": "__unsignedInt__",		
		"orderAppropriateness": "__Extension(valueCoding)__",
		"orderCustomField1": "__Extension(valueString)__",
		"orderCustomField2": "__Extension(valueString)__",
		"orderCustomMemo": "__Extension(valueString)__",
		"orderDateTime": "__dateTime__",
		"orderStatus": "__string__",
		"imagingOrganization": "__string__",
		"imagingFacility": "__string__",
		"financialClass": "__Coding__",
		"patientBalance": "__string__",
		"patientID": "__string__",
		"performingPhysician": "__string__",
		"performingPhysicianNPI": "__string__",
		"performingTechnologist": "__string__",
		"placerOrderNumber": "__string__",
		"procedureCode": [
			"__CodeableConcept__"
		],
		"procedureCodeDisplay": "__string__",
		"readingFacility": "__string__",
		"readingPhysician": "__string__",
		"readingPhysicianNPI": "__string__",
		"patientAddress": "__string__",
		"referringFacility": "__string__",
		"referringPhysician": "__string__",
		"referringPhysicianNPI": "__string__",
		"requestedAppointmentDateTime": "__dateTime__",
		"scheduledResource": "__string__",
		"birthDate": "__dateTime__",
		"birthSex": "__Extension(valueCode)__",
		"ssn": "__string__",
		"state": "__string__",
		"studyCustomMemo": "__Extension(valueString)__",
		"studyID": "__string__",
		"uidIdentifier": "__Identifier__",
		"timeAtStatus": "__string__",
		"timeZone": "__string__",
		"transcriptionist": "__string__",
		"transcriptionistFacility": "__string__",
		"specialArrangement": "__string__",
		"visitNumber": "__string__",
		"notes": "__Extension(extension)__",
		"clinical": "__Extension(valueString)__",
		"history": "__Extension(valueString)__",
		"laterality": "__Extension(valueCodingArray)__",
		"lateralityDisplay": [
			"__Coding__"
		],
		"bodyPart": "__Extension(valueCodingArray)__",
		"modalityModifierArray": "__Extension(valueCodingArray)__",
		"anatomicFocus": "__Extension(valueCodingArray)__",
		"pharmaceuticalObject": "__Extension(valueCodingArray)__",
		"priority": "__Extension(valueCoding)__",
		"reasonForExamObject": "__Extension(valueCodingArray)__",
		"viewObject": "__Extension(valueCodingArray)__",
		"techniqueObject": "__Extension(valueCoding)__",
		"requestedProcedureID": "__Extension(valueString)__",
		"studyDateTime": "__dateTime__",
		"status": "__Extension(valueCoding)__",
		"started": "__dateTime__"
	}`);
};

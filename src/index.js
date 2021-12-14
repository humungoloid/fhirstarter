require('dotenv').config();
const log = require('./utils/logging');
const initGlobals = require('./utils/globals');
initGlobals();
const handlePages = require('./fetcher/fhirJsonFetcher');
const FileGenerator = require('./file/fileGenerator');
const resources = require('./data/resources');
const fhirResourceUnitTestFileGenerator = require('./file/fhirResourceUnitTestFileGenerator');
// const ImagingStudyResource = require('../output/resource/ImagingStudyResource');

const fhirData = `{
	"resourceType": "ImagingStudy",
	"id": "746",
	"meta": {
		"versionId": "748487",
		"lastUpdated": "2021-12-13T14:59:41.5484096+00:00"
	},
	"extension": [
		{
			"url": "http://hl7.org/fhir/us/core/StructureDefinition/isActive",
			"valueBoolean": true
		},
		{
			"extension": [
				{
					"url": "text",
					"valueCoding": {
						"code": "12738006",
						"display": "Brain"
					}
				}
			],
			"url": "http://hl7.org/fhir/us/core/StructureDefinition/bodyPart"
		},
		{
			"url": "http://hl7.org/fhir/us/core/StructureDefinition/issuer",
			"valueReference": {
				"id": "1",
				"reference": "AssigningAuthority/1",
				"display": "RAMSOFT"
			}
		},
		{
			"url": "StartedUTC",
			"valueDateTime": "2021-06-25T08:03:04+00:00"
		},
		{
			"url": "http://hl7.org/fhir/us/core/StructureDefinition/performingPhysician",
			"valueReference": {
				"reference": "",
				"display": "SMITH^JOHN"
			}
		},
		{
			"url": "http://hl7.org/fhir/us/core/StructureDefinition/technologist",
			"valueReference": {
				"reference": "",
				"display": "JONES^MOLLY"
			}
		},
		{
			"url": "http://www.ramsoft.com/fhir/extension/numberOfAddendumReports",
			"valueInteger": 0
		},
		{
			"url": "http://www.ramsoft.com/fhir/extension/numberOfDiagReports",
			"valueInteger": 0
		},
		{
			"url": "http://www.ramsoft.com/fhir/extension/numberOfDictations",
			"valueInteger": 0
		},
		{
			"url": "http://www.ramsoft.com/fhir/extension/numberOfDocuments",
			"valueInteger": 0
		},
		{
			"url": "http://www.ramsoft.com/fhir/extension/numberOfFrames",
			"valueInteger": 11
		},
		{
			"url": "http://www.ramsoft.com/fhir/extension/numberOfImages",
			"valueInteger": 1
		},
		{
			"url": "http://www.ramsoft.com/fhir/extension/numberOfSignedPreliminary",
			"valueInteger": 0
		},
		{
			"url": "http://www.ramsoft.com/fhir/extension/numberOfSignedReports",
			"valueInteger": 0
		},
		{
			"url": "http://www.ramsoft.com/fhir/extension/imagingstudy/studyId",
			"valueString": "05024"
		},
		{
			"url": "http://hl7.org/fhir/us/core/StructureDefinition/priority",
			"valueString": "ROUTINE"
		},
		{
			"url": "http://hl7.org/fhir/us/core/StructureDefinition/status",
			"valueString": "COMPLETED"
		},
		{
			"url": "http://www.ramsoft.com/fhir/extension/isHL7Updated",
			"valueBoolean": false
		},
		{
			"url": "http://www.ramsoft.com/fhir/extension/isBilled",
			"valueBoolean": false
		},
		{
			"url": "http://www.ramsoft.com/fhir/extension/isPosted",
			"valueBoolean": false
		},
		{
			"url": "http://www.ramsoft.com/fhir/extension/imagingOrganization",
			"valueReference": {
				"id": "1",
				"reference": "Organization/1",
				"display": "RAMSOFT"
			}
		},
		{
			"url": "http://www.ramsoft.com/fhir/extension/receivedDateTime",
			"valueDateTime": "2021-12-13T09:59:15.6400000"
		},
		{
			"url": "http://www.ramsoft.com/fhir/extension/receivedDateTimeUTC",
			"valueDateTime": "2021-12-13T14:59:15+00:00"
		},
		{
			"url": "IsLockedStudy",
			"valueBoolean": false
		},
		{
			"url": "http://www.ramsoft.com/fhir/extension/department",
			"valueReference": {
				"display": "RAMSOFT"
			}
		},
		{
			"url": "http://hl7.org/fhir/us/core/StructureDefinition/timezone",
			"valueString": "Eastern Standard Time"
		}
	],
	"identifier": [
		{
			"system": "urn:dicom:uid",
			"value": "urn:oid:1.2.392.200036.9125.2.1624.659009988"
		},
		{
			"type": {
				"coding": [
					{
						"system": "http://terminology.hl7.org/CodeSystem/v2-0203",
						"code": "ACSN",
						"display": "Accession ID"
					}
				]
			},
			"system": "http://ginormoushospital.org/accession",
			"value": "202106242144736"
		}
	],
	"modality": [
		{
			"code": "KER",
			"display": "Keratometry"
		}
	],
	"subject": {
		"id": "520",
		"extension": [
			{
				"url": "http://www.ramsoft.com/fhir/extension/gender",
				"valueString": "other"
			},
			{
				"url": "http://www.ramsoft.com/fhir/extension/birthDate",
				"valueString": "1949-07-13"
			},
			{
				"url": "http://www.ramsoft.com/fhir/extension/managingOrganization",
				"valueReference": {
					"id": "1",
					"reference": "Organization/1",
					"display": "RAMSOFT"
				}
			},
			{
				"url": "isExternalIssuer",
				"valueBoolean": false
			}
		],
		"reference": "patient/520",
		"identifier": {
			"type": {
				"coding": [
					{
						"system": "http://hl7.org/fhir/v2/0203",
						"code": "MR"
					}
				]
			},
			"system": "urn:oid:1.2.36.146.595.217.0.1",
			"value": "D91ABB74-5F03-46CB-ACEE-6DE0DECEFFEF"
		},
		"display": "ATHENA^HOBERT^KLOCKO"
	},
	"encounter": {
		"id": "167",
		"reference": "Encounter/167",
		"identifier": {
			"type": {
				"coding": [
					{
						"system": "http://hl7.org/fhir/v2/0203",
						"code": "VN",
						"display": "Visit number"
					}
				]
			},
			"value": "14521"
		},
		"display": "14521"
	},
	"started": "2021-06-25T08:03:04.000000+00:00",
	"basedOn": [
		{
			"id": "518",
			"reference": "ServiceRequest/518"
		}
	],
	"referrer": {
		"reference": "",
		"display": "THOMAS^ALBERT"
	},
	"interpreter": [
		{
			"reference": "",
			"display": "PATEL^APU^^^MD"
		}
	],
	"numberOfSeries": 1,
	"numberOfInstances": 1,
	"description": "FMRI",
	"series": [
		{
			"uid": "1.2.392.200036.9125.2.17620817221411.16.24659009988",
			"number": 1,
			"modality": {
				"code": "KER",
				"display": "Keratometry"
			},
			"numberOfInstances": 1,
			"bodySite": {
				"system": "http://snomed.info/sct",
				"code": "12738006",
				"display": "Brain"
			},
			"instance": [
				{
					"uid": "1.3.12.2.1107.5.1.4.54693.16246.59014237",
					"number": 2
				}
			]
		}
	]
}`;
// (async function () {
// let resource = new ImagingStudyResource(fhirData);
// })();

// const ext = require('../output/utils/fhirExtensionResource');
// ext('test', { valueAge: 16, valueBase64Binary: '77' });

(async function () {
	try {
		let result = await handlePages.fetchAll(
			resources.allResources,
			resources.allDataTypes,
			resources.allMetadataTypes,
			resources.allSpecialCases
		);
		await FileGenerator.buildFiles(
			result.resources,
			result.dataTypes,
			resources.allQuantityTypes,
			result.specialCases
		);

		await fhirResourceUnitTestFileGenerator.buildUnitTestFiles(
			result.resources.map((elem) => JSON.parse(elem).name)
		);
		log.success('Finished!');
		let logFunc = FAILURES.length === 0 ? log.success : log.error;
		logFunc(`Failures: [${FAILURES.join(', ')}]`);
	} catch (error) {
		log.error(`Failed - Error: ${error.message}`);
	}
})();

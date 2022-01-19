module.exports = `{
	"resourceType": "ImagingStudyWorklist",
	"id": "230571",
	"meta": {
		"lastUpdated": "2016-12-20T09:16:40.4640352Z"
	},
	"subject": {
		"reference": "fhir/Patient/292158",
		"display": "1220^1220"
	},
	"identifier": [
		{
			"system": "urn:dicom:uid",
			"value": "urn:oid:1.2.124.113540.1.2.17968.14393.14137.12852"
		},
		{
			"assigner": {
				"display": "sample-accession"
			},
			"type": {
				"coding": [
					{
						"system": "http://terminology.hl7.org/CodeSystem/v2-0203",
						"code": "ACSN",
						"display": "sample-accession"
					}
				]
			},
			"system": "urn:oid:1.3.4.5.6.7",
			"value": "RAM1811"
		}
	],
	"procedureCode": [
		{
			"coding": [
				{
					"id": "8915",
					"extension": [
						{
							"url": "http://hl7.org/fhir/us/core/StructureDefinition/quantity",
							"valueInteger": 1
						},
						{
							"url": "http://www.ramsoft.com/fhir/extension/reasonCode",
							"extension": [
								{
									"url": "detailed",
									"valueCoding": {
										"id": "959",
										"code": "C14.8",
										"display": "Malignant neoplasm of overlapping sites of lip, oral cavity and pharynx"
									}
								}
							]
						}
					],
					"code": "86327",
					"display": "IMMUNOELECTROPHORESIS ASSAY"
				},
				{
					"id": "9273",
					"extension": [
						{
							"url": "http://hl7.org/fhir/us/core/StructureDefinition/quantity",
							"valueInteger": 1
						}
					],
					"code": "700-D62IDDHBDI",
					"display": "Description 12 345"
				}
			]
		}
	],
	"availability": "ONLINE",
	"sourceDeviceAETitle": "Test Application Entity Title from DICOM",
	"numberOfInstances": 1,
	"description": "XRAY CERVICAL SPINE 2/3 VIEWS",
	"series": [
		{
			"instance": [
				{
					"sopClass": "1.2.840.10008.5.1.4.1.1.88.11"
				}
			]
		}
	],
	"modality": [
		{
			"code": "BD",
			"display": "BONE DENSITY"
		}
	],
	"reasonCode": [
		{
			"coding": [
				{
					"code": "9878888",
					"display": "Scarlet fever with otitis media"
				},
				{
					"code": "A39.50",
					"display": "Meningococcal carditis, unspecified"
				}
			]
		}
	],
	"extension": [
		{
			"url": "notes",
			"extension": [
				{
					"url": "history",
					"valueString": "history note"
				},
				{
					"url": "clinical",
					"valueString": "clinical note"
				}
			]
		},
		{
			"url": "priority",
			"valueCoding": {
				"code": "20",
				"display": "ROUTINE"
			}
		},
		{
			"url": "http://hl7.org/fhir/us/core/StructureDefinition/studyStatus",
			"valueCoding": {
				"code": "20",
				"display": "ORDERED"
			}
		},
		{
			"url": "http://hl7.org/fhir/us/core/StructureDefinition/bodyPart",
			"extension": [
				{
					"url": "text",
					"valueCoding": {
						"code": "T-AB000",
						"display": "Ear"
					}
				},
				{
					"url": "text",
					"valueCoding": {
						"code": "T-D1200",
						"display": "Face"
					}
				}
			]
		},
		{
			"url": "requestedProcedureID",
			"valueString": "requestedProcedureID value"
		},
		{
			"url": "studyDateTime",
			"valueDateTime": "2016-12-21T16:15:00"
		},
		{
			"url": "http://hl7.org/fhir/us/core/StructureDefinition/technique",
			"valueCoding": {
				"code": "T-D4000",
				"display": "Abdomen"
			}
		},
		{
			"url": "laterality",
			"valueCoding": {
				"code": "B",
				"display": "BOTH"
			}
		},
		{
			"url": "http://hl7.org/fhir/us/core/StructureDefinition/modalityModifier",
			"extension": [
				{
					"url": "text",
					"valueCoding": {
						"code": "2VW",
						"display": "2 OR MORE VIEWS"
					}
				},
				{
					"url": "text",
					"valueCoding": {
						"code": "2VW",
						"display": "1 VIEW"
					}
				}
			]
		},
		{
			"url": "http://hl7.org/fhir/us/core/StructureDefinition/anatomicFocus",
			"extension": [
				{
					"url": "text",
					"valueCoding": {
						"code": "3VENT",
						"display": "3 VENT"
					}
				},
				{
					"url": "text",
					"valueCoding": {
						"code": "3VENT",
						"display": "1 VENT"
					}
				}
			]
		},
		{
			"url": "http://hl7.org/fhir/us/core/StructureDefinition/pharmaceutical",
			"extension": [
				{
					"url": "text",
					"valueCoding": {
						"code": "18F-NAF",
						"display": "18F-NAF"
					}
				},
				{
					"url": "text",
					"valueCoding": {
						"code": "18F-NAF",
						"display": "18F-NAFF"
					}
				}
			]
		},
		{
			"url": "http://hl7.org/fhir/us/core/StructureDefinition/view",
			"extension": [
				{
					"url": "text",
					"valueCoding": {
						"code": "AP",
						"display": "AP"
					}
				},
				{
					"url": "text",
					"valueCoding": {
						"code": "NEW",
						"display": "NEW"
					}
				}
			]
		},
		{
			"url": "http://hl7.org/fhir/us/core/StructureDefinition/reasonForExam",
			"extension": [
				{
					"url": "text",
					"valueCoding": {
						"code": "A1",
						"display": "A1"
					}
				},
				{
					"url": "text",
					"valueCoding": {
						"code": "A2",
						"display": "A2"
					}
				}
			]
		},
		{
			"url": "http://hl7.org/fhir/us/core/StructureDefinition/cds-id",
			"valueString": "CDSID-1230"
		},
		{
			"url": "http://hl7.org/fhir/us/core/StructureDefinition/cds-appropriate",
			"valueCoding": {
				"code": "UN",
				"display": "Unknown"
			}
		},
		{
			"url": "http://hl7.org/fhir/us/core/StructureDefinition/studycustomfield1",
			"valueString": "Custom Field 1"
		},
		{
			"url": "http://hl7.org/fhir/us/core/StructureDefinition/studycustomfield2",
			"valueString": "Custom Field 2"
		},
		{
			"url": "http://hl7.org/fhir/us/core/StructureDefinition/ordercustomfield1",
			"valueString": "DR Field1"
		},
		{
			"url": "http://hl7.org/fhir/us/core/StructureDefinition/ordercustomfield2",
			"valueString": "DR Field2"
		},
		{
			"url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex",
			"valueCode": "female"
		}
	],
	"studyID": "SID-03433",
	"patientID": "P947.586.103AU.88",
	"languages": [
		{
			"code": "ACH",
			"display": "ACOLI"
		},
		{
			"code": "DAN",
			"display": "DANISH"
		}
	],
	"gender": "MALE",
	"ssn": "241-30-7008",
	"cellPhone": "6704773144",
	"homePhone": "0323429201",
	"birthDate": "1994-08-19T00:00:00",
	"patientAddress": "A",
	"patientAge": 16,
	"patientBalance": "516.00",
	"accountStatus": "Entered in error",
	"accountNumber": "ACC-20180516-01",
	"timeZone": "SE Asia Standard Time",
	"examRoom": "ROOM_IMAGINGSTUDYWORKLIST_TEST",
	"imagingFacility": "ORGANIZATION_IMAGINGSTUDYWORKLIST_TEST",
	"readingPhysician": "ADMIN^TEST^MIDDLE",
	"readingFacility": "RAMSOFT",
	"referringPhysician": "ADMIN",
	"referringFacility": "RAMSOFT",
	"performingPhysician": "DICOM",
	"performingTechnologist": "DICOM",
	"transcriptionist": "DICOM",
	"transcriptionistFacility": "RAMSOFT",
	"dateTimeOrdered": "2018-06-12T11:20:28",
	"dateTimeVerified": "2017-02-23T01:24:09",
	"dateTimeTranscribed": "2011-02-07T09:20:03",
	"dateTimeSigned": "2017-08-04T12:01:01",
	"dateTimeRead": "2015-10-21T12:59:59",
	"dateTimeReceived": "2017-01-11T12:01:11",
	"dateTimeAddendum": "2018-02-02T11:00:00",
	"customField3": "Custom Field 3",
	"customField4": "Custom Field 4",
	"customField5": "Custom Field 5",
	"customField6": "Custom Field 6",
	"financialClass": {
		"code": "CM",
		"display": "COMMERCIAL"
	},
	"insurancePayer": {
		"reference": "fhir/Organization/104",
		"id": "104",
		"display": "PAYER FOR COVERAGE"
	},
	"insuranceCopay": 20180516.1,
	"insuranceExpiry": "2018-12-21T00:00:00",
	"insuranceStatus": "active",
	"allergies": [
		{
			"code": "227493005",
			"display": "test1"
		},
		{
			"code": "227493005",
			"display": "test2"
		}
	],
	"authorizationNumbers": "36987456321",
	"authorizationPeriod": "2018-01-01 -- 2018-12-31",
	"cancellationReason": "Sample cancellation reason",
	"chargeStatus": "Not Started",
	"communicationStatusName": "Waiting For Processing",
	"objectType": "A",
	"examDuration": "sample",
	"numImages": 30,
	"numReports": 40,
	"numFrames": 10,
	"patientLocation": "24",
	"visitNumber": "41425",
	"reportingDetail": "A",
	"scheduledResource": "A",
	"state": "VIRGINIA",
	"diagnosisCodes": "A00.0",
	"race": [
		{
			"code": "2076-8",
			"display": "NATIVE"
		},
		{
			"code": "2028-9",
			"display": "ASIAN"
		}
	],
	"ethnicity": [
		{
			"code": "2135-2",
			"display": "HISPANIC OR LATINO"
		},
		{
			"code": "UNK",
			"display": "DECLINED"
		}
	],
	"smokingStatus": [
		{
			"code": "428041000124106",
			"display": "A"
		},
		{
			"code": "428071000124103",
			"display": "B"
		},
		{
			"code": "77176002",
			"display": "C"
		}
	],
	"conditions": [
		{
			"code": "100149005",
			"display": "CAVICIDE"
		},
		{
			"code": "129007",
			"display": "Homoiothemia"
		}
	],
	"timeAtStatus": "12:46",
	"department": "A",
	"patientContactMethod": "E-MAIL",
	"visitClass": "PRE-ADMISSION",
	"eligibility": {
		"url": "http://ramsoft.com/hl7/extension", 
		"valueCoding": {
			"code": "UN",
			"display": "Pending"
		}
	},
	"fillerOrderNumber": "1200",
	"placerOrderNumber": "1300",
	"orderStatus": "EXAMDISCONTINUED",
	"orderDateTime": "2017-12-21T16:49:09",
	"requestedAppointmentDateTime": "2017-12-21T09:49:37",
	"orderCustomMemo": {
		"url": "http://hl7.org/fhir/us/core/StructureDefinition/ordercustommemo",
		"valueString": "DR Field2"
	},
	"patientEmail": "rqwplgy.tefrzx@ifqpoz.org",
	"readingPhysicianNPI": "NPI100201",
	"performingPhysicianNPI": "NPI002392",
	"referringPhysicianNPI": "NPITEST001",
	"transport": "Walk",
	"numObjects": 1,
	"started": "2019-04-09T18:01:00.000000"
}`;

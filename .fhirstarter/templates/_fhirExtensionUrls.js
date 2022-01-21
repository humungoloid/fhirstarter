module.exports = `const extensionUrls = {
	test: {
		test: 'http://hl7.org/fhir/us/core/StructureDefinition/test',
	},
	common: {
		orderControl: 'http://www.ramsoft.com/fhir/extension/orderControl',
		ambulatoryStatus:
			'http://hl7.org/fhir/us/core/StructureDefinition/ambulatoryStatus',
		anatomicFocus:
			'http://hl7.org/fhir/us/core/StructureDefinition/anatomicFocus',
		bodyPart: 'http://hl7.org/fhir/us/core/StructureDefinition/bodyPart',
		modalityModifier:
			'http://hl7.org/fhir/us/core/StructureDefinition/modalityModifier',
		pharmaceutical:
			'http://hl7.org/fhir/us/core/StructureDefinition/pharmaceutical',
		reasonForExam:
			'http://hl7.org/fhir/us/core/StructureDefinition/reasonForExam',
		laterality:
			'http://hl7.org/fhir/us/core/StructureDefinition/laterality',
		technique: 'http://hl7.org/fhir/us/core/StructureDefinition/technique',
		instructions:
			'http://hl7.org/fhir/us/core/StructureDefinition/instructions',
		view: 'http://hl7.org/fhir/us/core/StructureDefinition/view',
		birthSex:
			'http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex',
		ethnicity:
			'http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity',
		race: 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-race',
		lastUpdateUser:
			'http://hl7.org/fhir/us/core/StructureDefinition/lastUpdateUser',
		acceptLanguage: 'http://www.ramsoft.com/fhir/extension/acceptLanguage',
		status: 'http://hl7.org/fhir/us/core/StructureDefinition/status',
		statusChanged:
			'http://hl7.org/fhir/us/core/StructureDefinition/statusChanged',
		studyStatus:
			'http://hl7.org/fhir/us/core/StructureDefinition/studyStatus',
		priority: 'http://hl7.org/fhir/us/core/StructureDefinition/priority',
		referringPhysician:
			'http://hl7.org/fhir/us/core/StructureDefinition/referringPhysician',
		performingPhysician:
			'http://hl7.org/fhir/us/core/StructureDefinition/performingPhysician',
		technologist:
			'http://hl7.org/fhir/us/core/StructureDefinition/technologist',
		transcriptionist:
			'http://hl7.org/fhir/us/core/StructureDefinition/transcriptionist',
		readingPhysician:
			'http://hl7.org/fhir/us/core/StructureDefinition/readingPhysician',
		consultingPhysician:
			'http://hl7.org/fhir/us/core/StructureDefinition/consulting-physician',
		healthcareService:
			'http://hl7.org/fhir/us/core/StructureDefinition/HealthcareService',
		modality: 'http://hl7.org/fhir/us/core/StructureDefinition/modality',
		active: 'http://hl7.org/fhir/us/core/StructureDefinition/active',
		customField1: 'http://hl7.org/fhir/StructureDefinition/customfield1',
		customField2: 'http://hl7.org/fhir/StructureDefinition/customfield2',
		customMemo1: 'http://hl7.org/fhir/StructureDefinition/custommemo1',
		direct: 'http://hl7.org/fhir/StructureDefinition/us-core-direct',
		studyType: 'http://www.ramsoft.com/fhir/extension/studyType',
		loincCode: 'http://www.ramsoft.com/fhir/extension/loincCode',
		isHl7Updated: 'http://www.ramsoft.com/fhir/extension/isHL7Updated',
		isBilled: 'http://www.ramsoft.com/fhir/extension/isBilled',
		isPosted: 'http://www.ramsoft.com/fhir/extension/isPosted',
		organization: 'http://www.ramsoft.com/fhir/extension/organization',
		imagingOrganization:
			'http://www.ramsoft.com/fhir/extension/imagingOrganization',
		managingOrganization:
			'http://www.ramsoft.com/fhir/extension/managingOrganization',
		department: 'http://www.ramsoft.com/fhir/extension/department',
		room: 'http://www.ramsoft.com/fhir/extension/room',
		scheduledExamRoom:
			'http://www.ramsoft.com/fhir/extension/scheduledExamRoom',
		faxStatus: 'http://www.ramsoft.com/fhir/extension/faxStatus',
		faxStatusDateTime:
			'http://www.ramsoft.com/fhir/extension/faxStatusDateTime',
		chargePostedDateTime:
			'http://www.ramsoft.com/fhir/extension/chargePostedDateTime',
		receivedDateTime:
			'http://www.ramsoft.com/fhir/extension/receivedDateTime',
		signedDateTime: 'http://www.ramsoft.com/fhir/extension/signedDateTime',
		addendumDateTime:
			'http://www.ramsoft.com/fhir/extension/addendumDateTime',
		faxStatusDateTimeUTC:
			'http://www.ramsoft.com/fhir/extension/faxStatusDateTimeUTC',
		chargePostedDateTimeUTC:
			'http://www.ramsoft.com/fhir/extension/chargePostedDateTimeUTC',
		receivedDateTimeUTC:
			'http://www.ramsoft.com/fhir/extension/receivedDateTimeUTC',
		signedDateTimeUTC:
			'http://www.ramsoft.com/fhir/extension/signedDateTimeUTC',
		addendumDateTimeUTC:
			'http://www.ramsoft.com/fhir/extension/addendumDateTimeUTC',
		requestedProcedureID:
			'http://www.ramsoft.com/fhir/extension/requestedProcedureID',
		availabilityCode:
			'http://www.ramsoft.com/fhir/extension/availabilityCode',
		appointmentStartDateTime:
			'http://www.ramsoft.com/fhir/extension/appointmentStartDateTime',
		appointmentEndDateTime:
			'http://www.ramsoft.com/fhir/extension/appointmentEndDateTime',
		appointmentDuration:
			'http://www.ramsoft.com/fhir/extension/appointmentDuration',
		hl7Json: 'http://www.ramsoft.com/fhir/extension/hl7Json',
		isActive: 'http://hl7.org/fhir/us/core/StructureDefinition/isActive',
		gender: 'http://www.ramsoft.com/fhir/extension/gender',
		birthdate: 'http://www.ramsoft.com/fhir/extension/birthDate',
		sSN: 'http://www.ramsoft.com/fhir/extension/ssn',
		numberOfAddendumReports:
			'http://www.ramsoft.com/fhir/extension/numberOfAddendumReports',
		numberOfDiagReports:
			'http://www.ramsoft.com/fhir/extension/numberOfDiagReports',
		numberOfDictations:
			'http://www.ramsoft.com/fhir/extension/numberOfDictations',
		numberOfDocuments:
			'http://www.ramsoft.com/fhir/extension/numberOfDocuments',
		numberOfFrames: 'http://www.ramsoft.com/fhir/extension/numberOfFrames',
		numberOfImages: 'http://www.ramsoft.com/fhir/extension/numberOfImages',
		numberOfSignedPreliminary:
			'http://www.ramsoft.com/fhir/extension/numberOfSignedPreliminary',
		numberOfSignedReports:
			'http://www.ramsoft.com/fhir/extension/numberOfSignedReports',
		reasonCode: 'http://www.ramsoft.com/fhir/extension/reasonCode',
		text: 'text',
		address: 'http://www.ramsoft.com/fhir/extension/address',
		matchGrade: 'http://hl7.org/fhir/StructureDefinition/match-grade',
		severity: 'http://hl7.org/fhir/reaction-event-severity',
		localFileID: 'http://hl7.org/fhir/StructureDefinition/LocalFileID',
		isDistributedToHL7:
			'http://hl7.org/fhir/us/core/StructureDefinition/isDistributedToHL7',
		studyDateTime: 'http://hl7.org/fhir/StructureDefinition/studyDateTime',
		studyDescription:
			'http://hl7.org/fhir/StructureDefinition/StudyDescription',
	},
	account: {
		guarantorRelationship: 'guarantorRelationship',
	},
	appointment: {
		excludedDate:
			'http://www.ramsoft.com/fhir/extension/appointment/excludedDate',
		rRule: 'http://www.ramsoft.com/fhir/extension/appointment/rrule',
		allowToCreate:
			'http://www.ramsoft.com/fhir/extension/appointment/allowToCreate',
		temporaryBlock:
			'http://hl7.org/fhir/StructureDefinition/temporaryBlock',
		appointmentDateTime:
			'http://hl7.org/fhir/StructureDefinition/appointmentDateTime',
	},
	auditEvent: {
		requestQuery: 'requestQuery',
		accessionNumber: 'AccessionNumber',
		patientName: 'PatientName',
		patientID: 'PatientID',
		managingOrganization: 'ManagingOrganization',
		imagingFacility: 'ImagingFacility',
		studyStatus: 'StudyStatus',
		studyID: 'StudyID',
		visitNumber: 'VisitNumber',
		internalPatientID: 'InternalPatientID',
		internalEncounterID: 'InternalEncounterID',
		internalStudyID: 'InternalStudyID',
		internalProcedureRequestID: 'InternalProcedureRequestID',
		studyUID: 'StudyUID',
		currentResource: 'CurrentResource',
		matchedSubscription: 'MatchedSubscription',
		internalObjectID: 'InternalObjectID',
		lastUpdated: 'lastUpdated',
		taskCode: 'http://hl7.org/fhir/CodeSystem/task-code',
	},
	codeSystem: {
		searchConcept: 'searchConcept',
		inCatalog: 'InCatalog',
		catalogList: 'CatalogList',
	},
	communication: {
		status: 'http://www.ramsoft.com/fhir/extension/Communication/status',
		subject: 'http://www.ramsoft.com/fhir/extension/Communication/subject',
		conversationID:
			'http://www.ramsoft.com/fhir/extension/Communication/conversationID',
		folder: 'http://www.ramsoft.com/fhir/extension/Communication/folder',
		contactPoint:
			'http://www.ramsoft.com/fhir/extension/Communication/contactPoint',
		parent: 'http://www.ramsoft.com/fhir/extension/Communication/parent',
		failedCount:
			'http://www.ramsoft.com/fhir/extension/Communication/failedCount',
		note: 'http://www.ramsoft.com/fhir/extension/Communication/note',
		created: 'http://www.ramsoft.com/fhir/extension/Communication/created',
		read: 'http://www.ramsoft.com/fhir/extension/Communication/read',
		readtime:
			'http://www.ramsoft.com/fhir/extension/Communication/readtime',
	},
	communicationRequest: {
		nextDate:
			'http://www.ramsoft.com/fhir/extension/CommunicationRequest/nextDate',
		frequencyInDays:
			'http://www.ramsoft.com/fhir/extension/CommunicationRequest/frequencyInDays',
		active: 'http://www.ramsoft.com/fhir/extension/CommunicationRequest/active',
	},
	coverage: {
		financialClass: 'financialClass',
	},
	device: {
		healthCareService:
			'http://hl7.org/fhir/dicomserverconfig/healthcareservice',
		aeTitle: 'http://hl7.org/fhir/dicomserverconfig/dicomserveraetitle',
		device: 'http://hl7.org/fhir/dicomserverconfig/device',
		associatedDevice:
			'http://hl7.org/fhir/dicomserverconfig/associateddevice',
		imagingOrganization:
			'http://hl7.org/fhir/dicomserverconfig/imagingorganization',
		managingOrganization:
			'http://hl7.org/fhir/dicomserverconfig/managingorganization',
		features: 'http://hl7.org/fhir/dicomserverconfig/features',
		feature: 'feature',
		archiveServer: 'http://hl7.org/fhir/dicomserverconfig/archiveserver',
		hideRejectedInstances:
			'http://hl7.org/fhir/dicomserverconfig/hiderejectedinstances',
		needIOCMNotification:
			'http://hl7.org/fhir/dicomserverconfig/neediocmnotification',
		dicomServerPort:
			'http://hl7.org/fhir/dicomserverconfig/dicomserverport',
		dicomTimeout: 'http://hl7.org/fhir/dicomserverconfig/dicomtimeout',
		dicomMaxPDUSize:
			'http://hl7.org/fhir/dicomserverconfig/dicommaxpdusize',
		compression1: 'http://hl7.org/fhir/dicomserverconfig/compression1',
		compression2: 'http://hl7.org/fhir/dicomserverconfig/compression2',
		compression3: 'http://hl7.org/fhir/dicomserverconfig/compression3',
		jepgQuality: 'http://hl7.org/fhir/dicomserverconfig/jpegquality',
		tlsConnection: 'http://hl7.org/fhir/dicomserverconfig/tlsconnection',
		dicomServerTLSPort:
			'http://hl7.org/fhir/dicomserverconfig/dicomservertlsport',
		dicomServerHostName:
			'http://hl7.org/fhir/dicomserverconfig/dicomserverhostname',
		receiveStudyAs: 'http://hl7.org/fhir/dicomserverconfig/receivestudyas',
		receiveTimeout: 'http://hl7.org/fhir/dicomserverconfig/receiveTimeout',
		dicomscript: 'http://hl7.org/fhir/dicomserverconfig/dicomscript',
		dicomscriptdraft:
			'http://hl7.org/fhir/dicomserverconfig/dicomscriptdraft',
		dicomscriptdraftlastupdated:
			'http://hl7.org/fhir/dicomserverconfig/dicomscriptdraftlastupdated',
		description: 'http://hl7.org/fhir/dicomserverconfig/description',
		dicomscriptnote:
			'http://hl7.org/fhir/dicomserverconfig/dicomscriptnote',
		enableHeartbeat: 'enableHeartbeat',
		dicomRetrieveSupportCGet: 'dicomRetrieveSupportCGet',
		isActive: 'isActive',
		characterSet: 'characterSet',
		dicomweb: {
			featuresend: 'http://hl7.org/fhir/dicomserverconfig/featuresend',
			featureretrieve:
				'http://hl7.org/fhir/dicomserverconfig/featureretrieve',
			searchuri: 'http://hl7.org/fhir/dicomserverconfig/searchuri',
			retrieveuri: 'http://hl7.org/fhir/dicomserverconfig/retrieveuri',
			storeuri: 'http://hl7.org/fhir/dicomserverconfig/storeuri',
			authenticationtype:
				'http://hl7.org/fhir/dicomserverconfig/authenticationtype',
			username: 'http://hl7.org/fhir/dicomserverconfig/username',
			tokenuri: 'http://hl7.org/fhir/dicomserverconfig/tokenuri',
			claimsissuer:
				'http://hl7.org/fhir/dicomserverconfig/claimsissuerdcweb',
			jwtsigningalgorithm:
				'http://hl7.org/fhir/dicomserverconfig/jwtsigningalgorithm',
			scopes: 'http://hl7.org/fhir/dicomserverconfig/scopes',
			authorizationuri:
				'http://hl7.org/fhir/dicomserverconfig/authorizationuri',
			clientid: 'http://hl7.org/fhir/dicomserverconfig/clientiddcweb',
			dicomclientsecret:
				'http://hl7.org/fhir/dicomserverconfig/dicomclientsecret',
			dicomprivatekey:
				'http://hl7.org/fhir/dicomserverconfig/dicomprivatekey',
			dicompassword:
				'http://hl7.org/fhir/dicomserverconfig/dicompassword',
		},
	},
	diagnosisReport: {
		verificationFlag:
			'http://hl7.org/fhir/StructureDefinition/VerificationFlag',
		documentType: 'http://hl7.org/fhir/StructureDefinition/DocumentType',
		documentTypeID:
			'http://hl7.org/fhir/StructureDefinition/DocumentTypeID',
		isPatientLevel:
			'http://hl7.org/fhir/StructureDefinition/IsPatientLevel',
		isPrior: 'http://hl7.org/fhir/StructureDefinition/IsPrior',
		studyInstanceUID:
			'http://hl7.org/fhir/StructureDefinition/StudyInstanceUID',
		seriesInstanceUID:
			'http://hl7.org/fhir/StructureDefinition/SeriesInstanceUID',
		sopInstanceUID:
			'http://hl7.org/fhir/StructureDefinition/SOPInstanceUID',
		studyDateTime: 'http://hl7.org/fhir/StructureDefinition/StudyDateTime',
		studyDescription:
			'http://hl7.org/fhir/StructureDefinition/StudyDescription',
		fileKind: 'http://hl7.org/fhir/StructureDefinition/FileKind',
		isDistributed: 'http://hl7.org/fhir/StructureDefinition/IsDistributed',
		signStatus: 'http://hl7.org/fhir/StructureDefinition/SignStatus',
		modality: 'http://hl7.org/fhir/StructureDefinition/Modality',
		bodyPart: 'http://hl7.org/fhir/StructureDefinition/BodyPart',
		laterality: 'http://hl7.org/fhir/StructureDefinition/Laterality',
		imagingFacility:
			'http://hl7.org/fhir/StructureDefinition/ImagingFacility',
		readingPhysician:
			'http://hl7.org/fhir/StructureDefinition/ReadingPhysician',
		performingPhysician:
			'http://hl7.org/fhir/StructureDefinition/PerformingPhysician',
		referringPhysician:
			'http://hl7.org/fhir/StructureDefinition/ReferringPhysician',
		reportText: 'http://hl7.org/fhir/StructureDefinition/reportText',
		originalForm: 'http://hl7.org/fhir/StructureDefinition/originalForm',
	},
	encounter: {
		hasAppointment:
			'http://www.ramsoft.com/fhir/extension/Encounter/HasAppointment',
	},
	field: {
		defaultValue: 'defaultValue',
		minLength: 'minLength',
		maxLength: 'maxLength',
		mandatory: 'mandatory',
		enabled: 'enabled',
		hidden: 'hidden',
		mask: 'mask',
		errorMessage: 'errorMessage',
	},
	flag: {
		flagName: 'http://hl7.org/fhir/us/core/StructureDefinition/flagName',
	},
	healthcareService: {
		duration: 'Duration',
		color: 'http://www.ramsoft.com/fhir/extension/healthcareservice/color',
		overBooking:
			'http://hl7.org/fhir/us/core/StructureDefinition/overBooking',
		holidays:
			'http://www.ramsoft.com/fhir/extension/healthcareservice/holidays',
		holiday:
			'http://www.ramsoft.com/fhir/extension/healthcareservice/holiday',
		timeMultiplier: 'Time Multiplier',
		id: 'id',
		date: 'date',
	},
	imagingStudy: {
		note: 'http://www.ramsoft.com/fhir/extension/imagingstudy/notes',
		requestedProcedureID:
			'http://www.ramsoft.com/fhir/extension/imagingstudy/requestedProcedureID',
		studyDateTime:
			'http://www.ramsoft.com/fhir/extension/imagingstudy/studyDateTime',
		studyID: 'http://www.ramsoft.com/fhir/extension/imagingstudy/studyId',
		notes: {
			clinical:
				'http://hl7.org/fhir/us/core/StructureDefinition/clinical',
			history: 'http://hl7.org/fhir/us/core/StructureDefinition/history',
		},
		facility: 'facility',
		transcriptionist:
			'http://hl7.org/fhir/us/core/StructureDefinition/transcriptionist',
		performingPhysician:
			'http://hl7.org/fhir/us/core/StructureDefinition/performingPhysician',
		technologist:
			'http://hl7.org/fhir/us/core/StructureDefinition/technologist',
	},
	imagingStudyWorklist: {
		lateralityList:
			'http://hl7.org/fhir/us/core/StructureDefinition/LateralityList',
	},
	license: {
		id: 'id',
		licenseID: 'LicenseID',
		state: 'State',
		country: 'Country',
		specialty: 'Specialty',
		dea: 'DEA',
		effectiveFrom: 'EffectiveFrom',
		effectiveTo: 'EffectiveTo',
	},

	organization: {
		isManaging:
			'http://www.ramsoft.com/fhir/extension/organization/isManaging',
		practiceType:
			'http://www.ramsoft.com/fhir/extension/organization/practiceType',
		organizationType:
			'http://www.ramsoft.com/fhir/extension/organization/organizationType',
		managingOrganization:
			'http://www.ramsoft.com/fhir/extension/organization/managingOrganization',
		imagingOrganization:
			'http://www.ramsoft.com/fhir/extension/organization/imagingOrganization',
		workflowScript:
			'http://www.ramsoft.com/fhir/extension/organization/workflowScript',
		workflowScriptDraft:
			'http://www.ramsoft.com/fhir/extension/organization/workflowScriptDraft',
		workflowScriptDraftLastUpdated:
			'http://www.ramsoft.com/fhir/extension/organization/workflowScriptDraftLastUpdated',
		distributeToFacilityOnly:
			'http://hl7.org/fhir/us/core/StructureDefinition/distributeToFacilityOnly',
		distributeToParentOrganization:
			'http://hl7.org/fhir/us/core/StructureDefinition/distributeToParentOrganization',
		distributeToPractitioner:
			'http://hl7.org/fhir/us/core/StructureDefinition/distributeToPractitioner',
		inheritFromParentOrganization:
			'http://hl7.org/fhir/us/core/StructureDefinition/inheritFromParentOrganization',
		inheritStudyTypeFromParentOrganization:
			'http://hl7.org/fhir/us/core/StructureDefinition/inheritStudyTypeFromParentOrganization',
		preliminary:
			'http://hl7.org/fhir/us/core/StructureDefinition/preliminary',
		image: 'http://hl7.org/fhir/us/core/StructureDefinition/image',
		final: 'http://hl7.org/fhir/us/core/StructureDefinition/final',
		notes: 'http://hl7.org/fhir/us/core/StructureDefinition/notes',
		billingPayerID:
			'http://hl7.org/fhir/us/core/StructureDefinition/billingPayerID',
		eligibilityPayerID:
			'http://hl7.org/fhir/us/core/StructureDefinition/eligibilityPayerID',
		reportTemplate:
			'http://hl7.org/fhir/us/core/StructureDefinition/reportTemplate',
		reportTemplateId:
			'http://hl7.org/fhir/us/core/StructureDefinition/reportTemplateId',
		billingPayerIDRequired:
			'http://hl7.org/fhir/us/core/StructureDefinition/billingPayerIDRequired',
		financialClass:
			'http://hl7.org/fhir/us/core/StructureDefinition/financialClass',
		practiceType2:
			'http://hl7.org/fhir/us/core/StructureDefinition/practiceType',
		url: 'http://hl7.org/fhir/us/core/StructureDefinition/url',
		timezone: 'http://hl7.org/fhir/us/core/StructureDefinition/timezone',
		issuer: 'http://hl7.org/fhir/us/core/StructureDefinition/issuer',
		mask: 'http://hl7.org/fhir/us/core/StructureDefinition/mask',
		fax: 'http://hl7.org/fhir/us/core/StructureDefinition/fax',
		zipCode: 'http://hl7.org/fhir/us/core/StructureDefinition/zipCode',
		ssn: 'http://hl7.org/fhir/us/core/StructureDefinition/ssn',
		phone: 'http://hl7.org/fhir/us/core/StructureDefinition/phone',
		home: 'http://hl7.org/fhir/us/core/StructureDefinition/home',
		bussiness: 'http://hl7.org/fhir/us/core/StructureDefinition/bussiness',
		cell: 'http://hl7.org/fhir/us/core/StructureDefinition/cell',
		roleName: 'http://hl7.org/fhir/us/core/StructureDefinition/defaultRole',
		grantedOrganizationJson:
			'http://hl7.org/fhir/us/core/StructureDefinition/grantedOrganization',
		detail: 'detail',
		inheritStudyStatus:
			'http://www.ramsoft.com/fhir/extension/inheritStudyStatus',
		studyStatusList:
			'http://www.ramsoft.com/fhir/extension/studyStatusList',
		workflowStepList:
			'http://www.ramsoft.com/fhir/extension/workflowStepList',
		IDPLastSuccessfulConnection:
			'http://www.ramsoft.com/fhir/extension/organization/IDPLastSuccessfulConnection',
		IDPLastSuccessfulConnectionDomain:
			'http://www.ramsoft.com/fhir/extension/organization/IDPLastSuccessfulConnectionDomain',
	},
	organizationAffiliation: {
		studyStatusFrom:
			'http://hl7.org/fhir/us/core/StructureDefinition/studyStatusFrom',
		studyStatusTo:
			'http://hl7.org/fhir/us/core/StructureDefinition/studyStatusTo',
	},
	patientDocumentReference: {
		documentType: 'http://hl7.org/fhir/StructureDefinition/DocumentType',
		docTypeID: 'http://hl7.org/fhir/StructureDefinition/DocumentTypeID',
		conceptNameCode:
			'http://hl7.org/fhir/StructureDefinition/CoceptNameCode',
		reportNumber: 'http://hl7.org/fhir/StructureDefinition/ReportNumber',
		reportDateTime:
			'http://hl7.org/fhir/StructureDefinition/ReportDateTime',
	},
	patient: {
		mothersMaidenName:
			'http://hl7.org/fhir/StructureDefinition/patient-mothersMaidenName',
		employer: 'http://hl7.org/fhir/us/core/StructureDefinition/employer',
		employmentStatus:
			'http://hl7.org/fhir/us/core/StructureDefinition/employmentstatus',
		definitions:
			'http://hl7.org/fhir/us/core/StructureDefinition/definitions',
		birthSex:
			'http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex',
		race: 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-race',
		ethnicity:
			'http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity',
		matchGrade: 'http://hl7.org/fhir/StructureDefinition/match-grade',
		originalIssuerOfPatientID:
			'http://hl7.org/fhir/StructureDefinition/originalIssuerOfPatientID',
		originalPatientID:
			'http://hl7.org/fhir/StructureDefinition/originalPatientID',
		linkId: 'http://www.ramsoft.com/fhir/extension/patient/linkid',
	},
	practitioner: {
		configs: 'http://www.ramsoft.com/fhir/extension/practitioner/configs',
		configsMenuToolbar: 'menuToolbar',
		configsLeftPanel: 'leftPanel',
		configsToggleWorklistGrids: 'toggleWorklistGrids',
		configsSummaryFields: 'summaryFields',
		configsWorklist: 'worklist',
		configsPerspectiveConfiguration: 'perspectiveConfiguration',
		configsPinSection: 'pinSection',
		configsSchedulerPerspective: 'schedulerPerspective',
		userType: 'http://www.ramsoft.com/fhir/extension/practitioner/usertype',
		userTypeIsSyswideAdmin: 'isSyswideAdmin',
		userTypeIsAdmin: 'isAdmin',
		userTypeIsReadingPhysician: 'isReadingPhysician',
		userTypeIsReferringPhysician: 'isReferringPhysician',
		userTypeIsPerformingPhysician: 'isPerformingPhysician',
		userTypeIsPerformingTechnologist: 'isPerformingTechnologist',
		userTypeIsTranscriptionist: 'isTranscriptionist',
		canEmergencyAccess:
			'http://www.ramsoft.com/fhir/extension/practitioner/canEmergencyAccess',
		isUserActive:
			'http://www.ramsoft.com/fhir/extension/practitioner/isUserActive',
		isRoleActive:
			'http://www.ramsoft.com/fhir/extension/practitioner/isRoleActive',
		role: 'http://www.ramsoft.com/fhir/extension/practitioner/Role',
		group: 'http://www.ramsoft.com/fhir/extension/practitioner/Group',
		intergation:
			'http://www.ramsoft.com/fhir/extension/practitioner/Integration',
		note: 'http://www.ramsoft.com/fhir/extension/practitioner/note',
		license: 'http://www.ramsoft.com/fhir/extension/practitioner/license',
		externalAuthentication:
			'http://www.ramsoft.com/fhir/extension/practitioner/ExternalAuthentication',
		loginName:
			'http://www.ramsoft.com/fhir/extension/practitioner/LoginName',
		readingPhysician:
			'http://www.ramsoft.com/fhir/extension/practitioner/ReadingPhysician',
		reportingDetail:
			'http://www.ramsoft.com/fhir/extension/practitioner/ReportingDetails',
		auth0UserID:
			'http://www.ramsoft.com/fhir/extension/practitioner/Auth0UserID',
		reportingDetails: {
			preliminary: 'Preliminary',
			final: 'final',
			image: 'Image',
		},
		reportSignature:
			'http://www.ramsoft.com/fhir/extension/practitioner/reportSignature',
	},
	practitionerRole: {
		loginName: 'http://hl7.org/fhir/us/core/StructureDefinition/loginName',
		npi: 'http://hl7.org/fhir/us/core/StructureDefinition/practitionerNpi',
		userID: 'http://hl7.org/fhir/us/core/StructureDefinition/organizationUserId',
		role: 'http://hl7.org/fhir/us/core/StructureDefinition/role',
		isImaging:
			'http://www.ramsoft.com/fhir/extension/practitioner/isImaging',
	},
	procedureCode: {
		modifier: 'http://hl7.org/fhir/us/core/StructureDefinition/modifier',
		quantity: 'http://hl7.org/fhir/us/core/StructureDefinition/quantity',
		authorizationnumbers:
			'http://hl7.org/fhir/us/core/StructureDefinition/authorizationnumbers',
	},
	procedureRequest: {
		cancellationReason:
			'http://hl7.org/fhir/StructureDefinition/cancellationReason',
		transport: 'http://hl7.org/fhir/StructureDefinition/transport',
		cdsAppropriate:
			'http://hl7.org/fhir/StructureDefinition/cds-appropriate',
		cdsAppropriateUseCriteria:
			'http://hl7.org/fhir/StructureDefinition/cds-appropriateUseCriteria',
		cdsId: 'http://hl7.org/fhir/StructureDefinition/cds-id',
		cdsComments: 'http://hl7.org/fhir/StructureDefinition/cds-comments',
		eligibility: 'http://hl7.org/fhir/StructureDefinition/eligibility',
		eligibilityPrimaryPayerNotes:
			'http://hl7.org/fhir/StructureDefinition/eligibility-primaryPayerNotes',
		eligibilitySecondaryPayerNotes:
			'http://hl7.org/fhir/us/core/StructureDefinition/eligibility-secondaryPayerNotes',
		consultingPhysician:
			'http://hl7.org/fhir/StructureDefinition/consulting-physician',
		internalStudyTypeId:
			'http://hl7.org/fhir/StructureDefinition/internalStudyTypeId',
		studyDateTime: 'http://hl7.org/fhir/StructureDefinition/studyDateTime',
		studyStatus: 'http://hl7.org/fhir/StructureDefinition/studyStatus',
		modality: 'http://hl7.org/fhir/StructureDefinition/modality',
		laterality: 'http://hl7.org/fhir/StructureDefinition/laterality',
		requestedProcedureId:
			'http://hl7.org/fhir/StructureDefinition/requestedProcedureId',
		imagingFacility:
			'http://hl7.org/fhir/StructureDefinition/imagingFacility',
		managingOrganization:
			'http://hl7.org/fhir/StructureDefinition/managingOrganization',
		detailed: 'detailed',
		walkIn: 'http://hl7.org/fhir/StructureDefinition/walkIn',
		studyInstanceUid:
			'http://hl7.org/fhir/StructureDefinition/studyInstanceUid',
	},
	task: {
		userName: 'http://hl7.org/fhir/us/core/StructureDefinition/UserName',
		forAeTitle:
			'http://hl7.org/fhir/us/core/StructureDefinition/ForAETitle',
		peerHost: 'http://hl7.org/fhir/us/core/StructureDefinition/PeerHost',
		peerPort: 'http://hl7.org/fhir/us/core/StructureDefinition/PeerPort',
		useTls: 'http://hl7.org/fhir/us/core/StructureDefinition/UseTLS',
		ownerId: 'http://hl7.org/fhir/us/core/StructureDefinition/OwnerID',
		numWarning:
			'http://hl7.org/fhir/us/core/StructureDefinition/NumWarning',
		numError: 'http://hl7.org/fhir/us/core/StructureDefinition/NumError',
		numFailures:
			'http://hl7.org/fhir/us/core/StructureDefinition/NumFailures',
		numofObjects:
			'http://hl7.org/fhir/us/core/StructureDefinition/NumofObjects',
		numofRemaining:
			'http://hl7.org/fhir/us/core/StructureDefinition/NumofRemaining',
		patient: 'http://www.ramsoft.com/fhir/extension/Patient',
		loginUserID: 'http://www.ramsoft.com/fhir/extension/LoginUserID',
		loginIpAddress: 'http://www.ramsoft.com/fhir/extension/LoginIpAddress',
		loginSessionID: 'http://www.ramsoft.com/fhir/extension/SessionID',
		deviceClientID: 'http://www.ramsoft.com/fhir/extension/DeviceClientID',
		deviceType: 'http://www.ramsoft.com/fhir/extension/DeviceType',
		issuer: 'issuer',
		seriesUID: 'https://www.ramsoft.com/fhir/extension/SeriesUID',
		sopInstanceUID: 'https://www.ramsoft.com/fhir/extension/SOPInstanceUID',
		localFileID: 'https://www.ramsoft.com/fhir/extension/LocalFileID',
	},
	valueSet: {
		InCatalog: 'InCatalog',
		CatalogList: 'CatalogList',
	},
	subscription: {
		subType: 'http://hl7.org/fhir/us/core/StructureDefinition/SubType',
		SubscriptionUID:
			'http://www.ramsoft.com/fhir/extension/SubscriptionUID',
	},
};

export default extensionUrls;
`
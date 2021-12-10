module.exports = {
	// TODO: Automatically scrape all these resources/datatypes from fhir.org
	allResources: [
		'Account',
		'ActivityDefinition',
		'AdverseEvent',
		'AllergyIntolerance',
		'Appointment',
		'AppointmentResponse',
		'AuditEvent',
		'Basic',
		'Binary',
		'BiologicallyDerivedProduct',
		'BodyStructure',
		'Bundle',
		'CapabilityStatement',
		'CarePlan',
		'CareTeam',
		'CatalogEntry',
		'ChargeItem',
		'ChargeItemDefinition',
		'Claim',
		'ClaimResponse',
		'ClinicalImpression',
		'CodeSystem',
		'Communication',
		'CommunicationRequest',
		'CompartmentDefinition',
		'Composition',
		'ConceptMap',
		'Condition',
		'Consent',
		'Contract',
		'Coverage',
		'CoverageEligibilityRequest',
		'CoverageEligibilityResponse',
		'DetectedIssue',
		'Device',
		'DeviceDefinition',
		'DeviceMetric',
		'DeviceRequest',
		'DeviceUseStatement',
		'DiagnosticReport',
		'DocumentManifest',
		'DocumentReference',
		'EffectEvidenceSynthesis',
		'Encounter',
		'Endpoint',
		'EnrollmentRequest',
		'EnrollmentResponse',
		'EpisodeOfCare',
		'EventDefinition',
		'Evidence',
		'EvidenceVariable',
		'ExampleScenario',
		'ExplanationOfBenefit',
		'FamilyMemberHistory',
		'Flag',
		'Goal',
		'GraphDefinition',
		'Group',
		'GuidanceResponse',
		'HealthcareService',
		'ImagingStudy',
		'Immunization',
		'ImmunizationEvaluation',
		'ImmunizationRecommendation',
		'ImplementationGuide',
		'InsurancePlan',
		'Invoice',
		'Library',
		'Linkage',
		'List',
		'Location',
		'Measure',
		'MeasureReport',
		'Media',
		'Medication',
		'MedicationAdministration',
		'MedicationDispense',
		'MedicationKnowledge',
		'MedicationRequest',
		'MedicationStatement',
		'MedicinalProduct',
		'MedicinalProductAuthorization',
		'MedicinalProductContraindication',
		'MedicinalProductIndication',
		'MedicinalProductIngredient',
		'MedicinalProductInteraction',
		'MedicinalProductManufactured',
		'MedicinalProductPackaged',
		'MedicinalProductPharmaceutical',
		'MedicinalProductUndesirableEffect',
		'MessageDefinition',
		'MessageHeader',
		'MolecularSequence',
		'NamingSystem',
		'NutritionOrder',
		'Observation',
		'ObservationDefinition',
		'OperationDefinition',
		'OperationOutcome',
		'Organization',
		'OrganizationAffiliation',
		'Parameters',
		'Patient',
		'PaymentNotice',
		'PaymentReconciliation',
		'Person',
		'PlanDefinition',
		'Practitioner',
		'PractitionerRole',
		'Procedure',
		'Provenance',
		'Questionnaire',
		'QuestionnaireResponse',
		'RelatedPerson',
		'RequestGroup',
		'ResearchDefinition',
		'ResearchElementDefinition',
		'ResearchStudy',
		'ResearchSubject',
		'RiskAssessment',
		'RiskEvidenceSynthesis',
		'Schedule',
		'SearchParameter',
		'ServiceRequest',
		'Slot',
		'Specimen',
		'SpecimenDefinition',
		'StructureDefinition',
		'StructureMap',
		'Subscription',
		'Substance',
		'SubstancePolymer',
		'SubstanceProtein',
		'SubstanceReferenceInformation',
		'SubstanceSpecification',
		'SubstanceSourceMaterial',
		'SupplyDelivery',
		'SupplyRequest',
		'Task',
		'TerminologyCapabilities',
		'TestReport',
		'TestScript',
		'ValueSet',
		'VerificationResult',
		'VisionPrescription',
	],

	allQuantityTypes: [
		'Age', //
		'Count',
		'Duration',
		'Distance',
		'SimpleQuantity',
	],

	allMetadataTypes: [
		'ContactDetail',
		'Contributor',
		'DataRequirement',
		'Expression',
		'ParameterDefinition',
		'RelatedArtifact',
		'TriggerDefinition',
		'UsageContext',
	],

	allDataTypes: [
		//data types
		'Address',
		'Annotation',
		'Attachment',
		'CodeableConcept',
		'Coding',
		'ContactPoint',
		'HumanName',
		'Identifier',
		'Money',
		'Period',
		'Quantity',
		'Range',
		'Ratio',
		'SampledData',
		'Signature',
		'Timing',
	],

	// TODO: Handle special types
	allSpecialCases: [
		//special types
		'Dosage',
		'Meta',
		'Reference',
	],
};

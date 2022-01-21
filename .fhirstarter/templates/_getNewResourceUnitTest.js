module.exports = `import { getNewResource } from './getNewResource';
const fhirData = {
	resourceType: 'AuditEvent',
	id: 'example',
	text: {
		status: 'generated',
		div: \`&lt;div xmlns="http://www.w3.org/1999/xhtml"&gt;Application Start for under service login &amp;quot;Grahame&amp;quot; (id: Grahame's Test HL7Connect)&lt;/div&gt;\`,
	},
	type: {
		system: 'http://dicom.nema.org/resources/ontology/DCM',
		code: '110100',
		display: 'Application Activity',
	},
	subtype: [
		{
			system: 'http://dicom.nema.org/resources/ontology/DCM',
			code: '110120',
			display: 'Application Start',
		},
	],
	action: 'E',
	recorded: '2012-10-25T22:04:27+11:00',
	outcome: '0',
	agent: [
		{
			type: {
				coding: [
					{
						system: 'http://terminology.hl7.org/CodeSystem/extra-security-role-type',
						code: 'humanuser',
						display: 'human user',
					},
				],
			},
			role: [
				{
					text: 'Service User (Logon)',
				},
			],
			who: {
				identifier: {
					value: 'Grahame',
				},
			},
			requestor: false,
			network: {
				address: '127.0.0.1',
				type: '2',
			},
		},
		{
			type: {
				coding: [
					{
						system: 'http://dicom.nema.org/resources/ontology/DCM',
						code: '110153',
						display: 'Source Role ID',
					},
				],
			},
			who: {
				identifier: {
					system: 'urn:oid:2.16.840.1.113883.4.2',
					value: '2.16.840.1.113883.4.2',
				},
			},
			altId: '6580',
			requestor: false,
			network: {
				address: 'Workstation1.ehr.familyclinic.com',
				type: '1',
			},
		},
	],
	source: {
		site: 'Development',
		observer: {
			display: "Grahame's Laptop",
		},
		type: [
			{
				system: 'http://dicom.nema.org/resources/ontology/DCM',
				code: '110122',
				display: 'Login',
			},
		],
	},
	entity: [
		{
			what: {
				identifier: {
					type: {
						coding: [
							{
								system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
								code: 'SNO',
							},
						],
						text: 'Dell Serial Number',
					},
					value: 'ABCDEF',
				},
			},
			type: {
				system: 'http://terminology.hl7.org/CodeSystem/audit-entity-type',
				code: '4',
				display: 'Other',
			},
			role: {
				system: 'http://terminology.hl7.org/CodeSystem/object-role',
				code: '4',
				display: 'Domain Resource',
			},
			lifecycle: {
				system: 'http://terminology.hl7.org/CodeSystem/dicom-audit-lifecycle',
				code: '6',
				display: 'Access / Use',
			},
			name: "Grahame's Laptop",
		},
	],
};

describe('getNewResource', () => {
	it('should return the correct resource, mapped', () => {
		let result = getNewResource('AuditEvent', fhirData);
		expect(result['action']).toBe('E');
	});
});
`
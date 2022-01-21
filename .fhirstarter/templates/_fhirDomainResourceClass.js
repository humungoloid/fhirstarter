module.exports = `import FhirResource from './FhirResource';

export default class FhirDomainResource extends FhirResource {
	text;
	contained = [];

	extension = [];
	modifierExtension = [];

	constructor(rawData, schema) {
		super(rawData, { ...domainResourceSchema, ...schema });
	}
}

const domainResourceSchema = {
	text: '__Narrative__',
	contained: ['__Resource__'],
	extension: ['__Extension__'],
	modifierExtension: ['__Extension__'],
};

`
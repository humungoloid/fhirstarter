const exportMapping = (resourceList) => {
	if (typeof resourceList === 'string') {
		return resourceList.split(',').map(elem=>`${elem}Resource`).join(', ');
	} else {
		return resourceList.map(elem=>`${elem}Resource`).join(', ')
	}
}

export const index = 
`
import ${fhirResource}Resource from './${fhirResource}Resource';
export{${exportMapping(resourceList)}}
`

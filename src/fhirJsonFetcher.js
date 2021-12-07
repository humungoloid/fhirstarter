const axios = require('axios');
const HTMLParser = require('node-html-parser');
const SchemaGenerator = require("./fhirResourceSchemaGenerator");
const fs = require('fs').promises;

const path = require('path');

const outputDir = path.resolve(__dirname, '../output')

const FHIR_BASE_URL = `https://www.hl7.org/fhir`
//const MULTIVALUE_REGEX = /\[{(?<value>[^}\/]*)}]*,\s*\/\/\s*(?<comment>[^"]*)\\r\\n)/

const instance = axios.create({
    baseURL: FHIR_BASE_URL,
    timeout: 120000,
    headers: {'X-Requested-With': 'XMLHttpRequest'},
    transformResponse: [(data => data)]
});

const successes = [];
const failures = [];

var dataTypePage, metaDataTypePage

const hasData = () => {
    return !!dataTypePage && !!metaDataTypePage;
} 

/**
 * 
 * @returns {Object} An object containing data type and metadata type pages
 */
const fetchAllPages = () => {
    const result = {
        dataTypesPage: null,
        metaDataTypesPage: null
    }
    return new Promise((resolve, reject) => {
        try {
            getDataTypesPage('/datatypes.html')
            .then((response) => {
                console.log('Got data types');
                result.dataTypesPage = response.data;
                getDataTypesPage('/metadatatypes.html').then((responseTwo) => {
                    console.log('Got metadata types');
                    result.metaDataTypesPage = responseTwo.data;
                    resolve(result);
                })
            })
            .catch(reject());
        } catch {
            reject();
        }
    });
}

const handlePages = (resourcesToWorkWith, dataTypesToWorkWith, metaDataTypes) => 
    new Promise((resolve, reject) => {
        let dataTypeSchemas = [], 
            resourceSchemas = [];
        try {
            for (let page of resourcesToWorkWith) {
                getFhirPage(page).then(result => resourceSchemas.push(result));
            }
            
            for (let dataType of dataTypesToWorkWith) {
                getDataType(dataType).then(result => dataTypeSchemas.push(result));
            }
        
            for (let metaDataType of metaDataTypes) {
                getMetaDataType(metaDataType).then(result => dataTypeSchemas.push(result));
            }
            
            resolve({resources: resourceSchemas, dataTypes: dataTypeSchemas});
        } catch {
            reject('fail');
        }
    });

const getDataTypesPage = (page) => {
    return new Promise((resolve, reject) => {
        instance.get(page).then((response) => {
            console.log('response successful');
            resolve(response);
        });
    })
}

const getFhirPage = (resourceName) => {
    return new Promise((resolve, reject) => {
        instance.get(`/${resourceName}.html`).then((response) => {
            
            let data = HTMLParser.parse(response.data);
            let child = HTMLParser.parse(data.querySelector('#tabs-json').querySelector('#json-inner').childNodes[1].childNodes[0].innerText);
            let rawJson = "";
            child.childNodes.map(elem => rawJson = rawJson + elem.innerText);
            let result = '';
            try {
                result = SchemaGenerator.processResourceJson(rawJson, resourceName)
                console.log(`Success: ${resourceName}`)
                successes.push(resourceName);
            } catch {
                console.log(`Failed: ${resourceName}`)
                failures.push(resourceName);
            }
            resolve(JSON.stringify(result));
        });
    })    
};

const processPageData = (response, dataType) => {
    let data = HTMLParser.parse(response.data),
        childOne = data.querySelector(`#tabs-${dataType}-json`),
        child = HTMLParser.parse(childOne.querySelector(`#json`).querySelector(`#json-inner`).childNodes[1].childNodes[0].innerText),
        rawJson = "";
    child.childNodes.map(elem => rawJson = rawJson + elem.innerText);
    let result = SchemaGenerator.processResourceJson(rawJson)

    console.log(`Success: ${dataType}`)
    return JSON.stringify(result);
}

const getDataType = (dataType) => {
    return new Promise((resolve, reject) => {
        try {
            instance.get(`datatypes.html`).then((response) => {
                resolve(processPageData(response, dataType))
            })
        } catch {
            reject('getDataType failed');
        }
    })
}

const getMetaDataType = (dataType) => {
    return new Promise((resolve, reject) => {
        try {
            instance.get(`metadatatypes.html`).then((response) => {
                resolve(processPageData(response, dataType))
            })
        } catch {
            reject('getMetaDataType failed');
        }
    })
}

module.exports = {
    fetchAll: fetchAllPages,
    handlePages: handlePages,
    getDataTypesPage: getDataTypesPage,
    getMetaDataType: getMetaDataType,
    getFhirPage: getFhirPage, 
    getDataType: getDataType
}

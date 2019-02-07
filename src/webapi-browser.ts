import { Guid, QueryOptions, Entity, RetrieveMultipleResponse, FunctionInput, ChangeSet, WebApiConfig, WebApiRequestConfig, WebApiRequestResult } from './models';
import * as webApi from "./webapi";

function submitRequest(config: WebApiRequestConfig,
    callback: (result: WebApiRequestResult) => void): void {
    const req: XMLHttpRequest = new XMLHttpRequest();

    req.open(config.method, encodeURI(`${this._config.url}/${config.queryString}`), true);

    const headers: any = webApi.getHeaders(config);

    for (let header in headers) {
        if (headers.hasOwnProperty(header)) {
            req.setRequestHeader(header, headers[header]);
        }
    }

    req.onreadystatechange = () => {
        if (req.readyState === 4 /* complete */) {
            req.onreadystatechange = null;

            if ((req.status >= 200) && (req.status < 300)) {
                callback({ error: false, response: req.response, headers: req.getAllResponseHeaders() });
            } else {
                callback({ error: true, response: req.response, headers: req.getAllResponseHeaders() });
            }
        }
    };

    if (config.body != null) {
        req.send(config.body);
    } else {
        req.send();
    }
}

/**
 * Retrieve a record from CRM
 * @param apiConfig WebApiConfig object
 * @param entityType Type of entity to retrieve
 * @param id Id of record to retrieve
 * @param queryString OData query string parameters
 * @param queryOptions Various query options for the query
 */
export function retrieve(apiConfig: WebApiConfig, entitySet: string, id: Guid,
    queryString?: string, queryOptions?: QueryOptions): Promise<Entity> {
    return webApi.retrieve(apiConfig, entitySet, id, submitRequest, queryString, queryOptions);
}

/**
 * Retrieve multiple records from CRM
 * @param apiConfig WebApiConfig object
 * @param entitySet Type of entity to retrieve
 * @param queryString OData query string parameters
 * @param queryOptions Various query options for the query
 */
export function retrieveMultiple(apiConfig: WebApiConfig, entitySet: string, queryString?: string,
    queryOptions?: QueryOptions): Promise<RetrieveMultipleResponse> {
    return webApi.retrieveMultiple(apiConfig, entitySet, submitRequest, queryString, queryOptions);
}

/**
 * Retrieve next page from a retrieveMultiple request
 * @param apiConfig WebApiConfig object
 * @param url Query from the @odata.nextlink property of a retrieveMultiple
 * @param queryOptions Various query options for the query
 */
export function retrieveMultipleNextPage(apiConfig: WebApiConfig, url: string,
    queryOptions?: QueryOptions): Promise<RetrieveMultipleResponse> {
    return webApi.retrieveMultipleNextPage(apiConfig, url, submitRequest, queryOptions);
}

/**
 * Create a record in CRM
 * @param apiConfig WebApiConfig object
 * @param entitySet Type of entity to create
 * @param entity Entity to create
 * @param queryOptions Various query options for the query
 */
export function create(apiConfig: WebApiConfig, entitySet: string, entity: Entity, queryOptions?: QueryOptions): Promise<null> {
    return webApi.create(apiConfig, entitySet, entity, submitRequest, queryOptions);
}

/**
 * Create a record in CRM and return data
 * @param apiConfig WebApiConfig object
 * @param entitySet Type of entity to create
 * @param entity Entity to create
 * @param select Select odata query parameter
 * @param queryOptions Various query options for the query
 */
export function createWithReturnData(apiConfig: WebApiConfig, entitySet: string, entity: Entity, select: string,
    queryOptions?: QueryOptions): Promise<Entity> {
    return webApi.createWithReturnData(apiConfig, entitySet, entity, select, submitRequest, queryOptions);
}

/**
 * Update a record in CRM
 * @param apiConfig WebApiConfig object
 * @param entitySet Type of entity to update
 * @param id Id of record to update
 * @param entity Entity fields to update
 * @param queryOptions Various query options for the query
 */
export function update(apiConfig: WebApiConfig, entitySet: string, id: Guid, entity: Entity, queryOptions?: QueryOptions): Promise<null> {
    return webApi.update(apiConfig, entitySet, id, entity, submitRequest, queryOptions);
}

/**
 * Create a record in CRM and return data
 * @param apiConfig WebApiConfig object
 * @param entitySet Type of entity to create
 * @param id Id of record to update
 * @param entity Entity fields to update
 * @param select Select odata query parameter
 * @param queryOptions Various query options for the query
 */
export function updateWithReturnData(apiConfig: WebApiConfig, entitySet: string, id: Guid, entity: Entity, select: string,
    queryOptions?: QueryOptions): Promise<Entity> {
    return webApi.updateWithReturnData(apiConfig, entitySet, id, entity, select, submitRequest, queryOptions);
}

/**
 * Update a single property of a record in CRM
 * @param apiConfig WebApiConfig object
 * @param entitySet Type of entity to update
 * @param id Id of record to update
 * @param attribute Attribute to update
 * @param queryOptions Various query options for the query
 */
export function updateProperty(apiConfig: WebApiConfig, entitySet: string, id: Guid, attribute: string, value: any,
    queryOptions?: QueryOptions): Promise<null> {
    return webApi.updateProperty(apiConfig, entitySet, id, attribute, value, submitRequest, queryOptions);
}

/**
 * Delete a record from CRM
 * @param apiConfig WebApiConfig object
 * @param entitySet Type of entity to delete
 * @param id Id of record to delete
 */
export function deleteRecord(apiConfig: WebApiConfig, entitySet: string, id: Guid): Promise<null> {
    return webApi.deleteRecord(apiConfig, entitySet, id, submitRequest);
}

/**
 * Delete a property from a record in CRM. Non navigation properties only
 * @param apiConfig WebApiConfig object
 * @param entitySet Type of entity to update
 * @param id Id of record to update
 * @param attribute Attribute to delete
 */
export function deleteProperty(apiConfig: WebApiConfig, entitySet: string, id: Guid, attribute: string): Promise<null> {
    return webApi.deleteProperty(apiConfig, entitySet, id, attribute, submitRequest);
}

/**
 * Associate two records
 * @param apiConfig WebApiConfig object
 * @param entitySet Type of entity for primary record
 * @param id Id of primary record
 * @param relationship Schema name of relationship
 * @param relatedEntitySet Type of entity for secondary record
 * @param relatedEntityId Id of secondary record
 * @param queryOptions Various query options for the query
 */
export function associate(apiConfig: WebApiConfig, entitySet: string, id: Guid, relationship: string, relatedEntitySet: string,
    relatedEntityId: Guid, queryOptions?: QueryOptions): Promise<null> {
    return webApi.associate(apiConfig, entitySet, id, relationship, relatedEntitySet, relatedEntityId, submitRequest, queryOptions);
}

/**
 * Disassociate two records
 * @param apiConfig WebApiConfig obje
 * @param entitySet Type of entity for primary record
 * @param id  Id of primary record
 * @param property Schema name of property or relationship
 * @param relatedEntityId Id of secondary record. Only needed for collection-valued navigation properties
 */
export function disassociate(apiConfig: WebApiConfig, entitySet: string, id: Guid, property: string,
    relatedEntityId?: Guid): Promise<null> {
    return webApi.disassociate(apiConfig, entitySet, id, property, submitRequest, relatedEntityId);
}

/**
 * Execute a default or custom bound action in CRM
 * @param apiConfig WebApiConfig object
 * @param entitySet Type of entity to run the action against
 * @param id Id of record to run the action against
 * @param actionName Name of the action to run
 * @param inputs Any inputs required by the action
 * @param queryOptions Various query options for the query
 */
export function boundAction(apiConfig: WebApiConfig, entitySet: string, id: Guid, actionName: string, inputs?: Object,
    queryOptions?: QueryOptions): Promise<any> {
    return webApi.boundAction(apiConfig, entitySet, id, actionName, submitRequest, inputs, queryOptions);
}

/**
 * Execute a default or custom unbound action in CRM
 * @param apiConfig WebApiConfig object
 * @param actionName Name of the action to run
 * @param inputs Any inputs required by the action
 * @param queryOptions Various query options for the query
 */
export function unboundAction(apiConfig: WebApiConfig, actionName: string, inputs?: Object, queryOptions?: QueryOptions): Promise<any> {
    return webApi.unboundAction(apiConfig, actionName, submitRequest, inputs, queryOptions);
}

/**
 * Execute a default or custom bound action in CRM
 * @param apiConfig WebApiConfig object
 * @param entitySet Type of entity to run the action against
 * @param id Id of record to run the action against
 * @param functionName Name of the action to run
 * @param inputs Any inputs required by the action
 * @param queryOptions Various query options for the query
 */
export function boundFunction(apiConfig: WebApiConfig, entitySet: string, id: Guid, functionName: string,
    inputs?: FunctionInput[], queryOptions?: QueryOptions): Promise<any> {
    return webApi.boundFunction(apiConfig, entitySet, id, functionName, submitRequest, inputs, queryOptions);
}

/**
 * Execute an unbound function in CRM
 * @param apiConfig WebApiConfig object
 * @param functionName Name of the action to run
 * @param inputs Any inputs required by the action
 * @param queryOptions Various query options for the query
 */
export function unboundFunction(apiConfig: WebApiConfig, functionName: string, inputs?: FunctionInput[],
    queryOptions?: QueryOptions): Promise<any> {
    return webApi.unboundFunction(apiConfig, functionName, submitRequest, inputs, queryOptions);
}

/**
 * Execute a batch operation in CRM
 * @param apiConfig WebApiConfig object
 * @param batchId Unique batch id for the operation
 * @param changeSetId Unique change set id for any changesets in the operation
 * @param changeSets Array of change sets (create or update) for the operation
 * @param batchGets Array of get requests for the operation
 * @param queryOptions Various query options for the query
 */
export function batchOperation(apiConfig: WebApiConfig, batchId: string, changeSetId: string, changeSets: ChangeSet[],
    batchGets: string[], queryOptions?: QueryOptions): Promise<any> {
    return webApi.batchOperation(apiConfig, batchId, changeSetId, changeSets, batchGets, submitRequest, queryOptions);
}
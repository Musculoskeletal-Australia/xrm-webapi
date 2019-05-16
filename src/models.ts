export class WebApiConfig {
    public version: string;
    public accessToken?: string;
    public url?: string;

    /**
     * Constructor
     * @param config WebApiConfig
     */
    constructor(version: string, accessToken?: string, url?: string ) {
        // If URL not provided, get it from Xrm.Context
        if (url == null) {
            const context: Xrm.Context =
                typeof GetGlobalContext !== 'undefined' ? GetGlobalContext() : Xrm.Page.context;
            url = `${context.getClientUrl()}/api/data/v${version}`;

            this.url = url;
        } else {
            this.url = `${url}/api/data/v${version}`;
            this.url = this.url.replace('//', '/');
        }

        this.version = version;
        this.accessToken = accessToken;
    }
}

export interface WebApiRequestResult {
    error: boolean;
    response: any;
    headers?: any;
}

export interface WebApiRequestConfig {
    method: string;
    contentType: string;
    body?: any;
    queryString: string;
    apiConfig: WebApiConfig;
    queryOptions?: QueryOptions;
}

export class Guid {
    public value: string;

    constructor(value: string) {
        value = value.replace(/[{}]/g, '');

        if (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(value)) {
            this.value = value.toUpperCase();
        } else {
            throw Error(`Id ${value} is not a valid GUID`);
        }
    }

    public areEqual(compare: Guid): boolean {
        if (this === null || compare === null || this === undefined || compare === undefined) {
            return false;
        }

        return this.value.toLowerCase() === compare.value.toLowerCase();
    }
}

export interface QueryOptions {
    includeFormattedValues?: boolean;
    includeLookupLogicalNames?: boolean;
    includeAssociatedNavigationProperties?: boolean;
    maxPageSize?: number;
    impersonateUser?: Guid;
    representation?: boolean;
}

export interface Entity {
    [propName: string]: any;
}

export interface RetrieveMultipleResponse {
    value: Entity[];
    '@odata.nextlink': string;
}

export interface ChangeSet {
    queryString: string;
    entity: object;
}

export interface FunctionInput {
    name: string;
    value: string;
    alias?: string;
}

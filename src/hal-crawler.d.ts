import * as Immutable from 'immutable';


export interface HalCrawlerConfigI {
	root: string,
	[index: string]: any,
}

type HalCrawlerConfigMap = Immutable.Map<string, HalCrawlerConfigI>;

type HalCrawlerAction = 'GET' | 'POST' | 'PUT' | 'DELETE'

export const action: {
	GET: 'GET',
	POST: 'POST',
	PUT: 'PUT',
	DELETE: 'DELETE'
}

/**
* creates and validates a configuration object
* @param  config object which must contain root url and might contain other config such as http headers e.g.: {root: "localhost:8080/api", headers: {"Accept-Language": "en-US"}}
* @return configuration instance
*/
export function createConfig(config: HalCrawlerConfigI): HalCrawlerConfigMap;

declare class Schema {
	/**
   *
   * @param  string name        will be used as a unique identifier for a schema (there must never be multiple schemas with the same name)
   * @param  [string] identifiers an array of strings which defines the attributes required to uniquely define a resource
   * @param  Action action     the action which can be performed on an endpoint
   * @param  [Schema] children    defines the schemas underneath the parent schema
   * @return undefined
   */
	constructor(name: string, identifiers: string[], action: HalCrawlerAction[], children?: Schema[][])

  getName(): string

  getIdentifiers(): any

  getAction(): HalCrawlerAction

  getChildren(): Schema[]

	addChild(newChild: Schema): void

	isMultiInstanceSchema(): boolean
}

/**
 * A Resource represents an instance of a Schema definition.
 */
declare class Resource {
  constructor(schema: Schema, link?: string, data?: any)

  getSchema(): Schema

  getLink(): string

  getData(): any

	isShallow(): boolean

	getPromise(): Promise<any>

	isPending(): boolean

	getChildLink(schema: Schema): any

	getChildData(schema: Schema): any
}

declare class Command {
  constructor(resource: Resource, action?: HalCrawlerAction)

  getResource(): Resource

  getAction(): HalCrawlerAction
}

/**
 * fetches a HAL resource and returns an extended version of the store
 * @param  config  [configuration]
 * @param  command [defines what to execute]
 * @param  store  [current store instance or {}]
 * @return store with new resources
 */
export function crawl<T>(config: HalCrawlerConfigMap, command: Command, store: Immutable.Map<string, T>): Promise<T>;

export function putInStoreAsPending(promise: Promise<any>, resource: Resource, store: any): any;

/**
 * loads a given resource from the store
 * @param  Immutable.Map store    Location of the Resource
 * @param  Resource resource Resource without data (must contain link)
 * @return Resource          Resource with data
 */
export function getResourceFromStore<T>(store: Immutable.Map<string, T>, resource: Resource): Resource

/**
 * creates and validates a configuration object
 * @param  config object which must contain root url and might contain other config such as http headers e.g.: {root: "localhost:8080/api", headers: {"Accept-Language": "en-US"}}
 * @return configuration instance
 */
export function createConfig(config: { root: string }): Immutable.Map<string, any>

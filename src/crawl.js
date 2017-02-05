import "whatwg-fetch";
import Resource from "./Resource";

const load = (url) => {
  return fetch(url).then(response => new Resource(schema, response.json()));
};

/**
 * fetches a HAL resource
 * @param  config  [configuration]
 * @param  stores  [current store instance or {}]
 * @param  resource [root resource]
 * @param  command [defines what to execute]
 * @return stores with new resources
 */
export default function crawl(config, stores, schema, command) {
  const resource = command.getResource();
  const action = command.getAction();

  // root resource
  if (resource === undefined && action === undefined) {
    return load(config.get("root"));
  } else {
    // find first store which contains a schema
    // TODO: the same schema might be in different stores
    const storeLocation = stores.find(store => {
      return store[schema.getName()] !== undefined;
    });

    if (storeLocation === undefined) {
      // no element of this type has already been loaded

    } else {
      // the element could be here
    }
  }
}

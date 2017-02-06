import load from "./utils/load";
import constants from "./constants";
import action from "./action";
import convertToStore from "./utils/convertToStore";
import getResourceFromStore from "./utils/getResourceFromStore";

/**
 * fetches a HAL resource
 * @param  config  [configuration]
 * @param  stores  [current store instance or {}]
 * @param  resource [root resource]
 * @param  command [defines what to execute]
 * @return store with new resources
 */
export default function crawl(config, store, schema, command) {
  const resource = command.getResource();
  const desiredAction = command.getAction();

  // for first call to a HAL API there is no resource instance
  if (resource === undefined) {
    return load(config.get(constants.config.root)).then(response => response.json().then(data => convertToStore(schema, data, store)));
  } else {
    if (desiredAction === action.GET) {
      const resourceInStore = getResourceFromStore(store, schema, resource);
      if (resourceInStore === undefined) {
        return load(resource.getLink().href).then(response => response.json().then(data => convertToStore(schema, data, store)));
      } else {
        return Promise.resolve(resourceInStore);
      }
    } else {
      console.warn(action + " action is not supported yet");
    }
  }
}

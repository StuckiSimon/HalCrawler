import Immutable from "immutable";
import load from "./utils/load";
import constants from "./constants";
import action from "./action";
import convertToStore from "./utils/convertToStore";
import getResourceFromStore from "./utils/getResourceFromStore";

/**
 * fetches a HAL resource and returns an extended version of the store
 * @param  config  [configuration]
 * @param  command [defines what to execute]
 * @param  store  [current store instance or {}]
 * @return store with new resources
 */
export default function crawl(config, command, store = Immutable.Map({})) {
  const resource = command.getResource();
  const schema = resource.getSchema();
  const desiredAction = command.getAction();

  // for first call to a HAL API there is no resource instance
  if (resource.getLink() === undefined) {
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

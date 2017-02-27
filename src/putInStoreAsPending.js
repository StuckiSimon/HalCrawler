import Immutable from "immutable";
import constants from "./constants";
import convertToStore from "./utils/convertToStore";

/**
 *
 */
export default function putInStoreAsPending(promise, resource, store) {
  promise.done = false;
  promise.then(() => {
    promise.done = true;
  });
  let data = resource.getData();
  if(data === undefined) {
    data = {};
    resource.data = data; // TODO
  }
  if(!data[constants.crawlerInfoObject]) {
    data[constants.crawlerInfoObject] = {};
  }
  data[constants.crawlerInfoObject]['promise'] = promise;
  return convertToStore(resource.getSchema(), resource.getData(), store);
}

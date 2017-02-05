import Immutable from "immutable";

/**
 * creates a store using the given store
 * @param  stores different stores to merge
 * @return combined store
 */
export default function createStore(...stores) {
  return Immutable.List(stores);
}

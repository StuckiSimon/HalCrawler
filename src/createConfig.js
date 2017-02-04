import Immutable from "immutable";

/**
 * creates and validates a configuration object
 * @param  config object which contains http headers e.g.: {"Accept-Language": "en-US"}
 * @return configuration instance
 */
export default function createConfig(config) {
  return Immutable.Map({});
}

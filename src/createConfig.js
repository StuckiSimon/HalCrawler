import Immutable from 'immutable';

/**
 * creates and validates a configuration object
 * @param  config object which must contain root url and might contain other config such as http headers e.g.: {root: "localhost:8080/api", headers: {"Accept-Language": "en-US"}, , fetchOptions: {"credentials": "include"}}
 * @return configuration instance
 */
export default function createConfig(config) {
    if (config === undefined) {
        throw new Error('config must be an object');
    } else if (config.root === undefined || typeof config.root !== 'string') {
        throw new Error('config.root must be a valid url');
    }
    return Immutable.Map(config);
}

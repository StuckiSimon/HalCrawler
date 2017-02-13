/**
 * A Command represents an action on an instance or the root resource
 */
export default class Command {
  /**
   * if ignoreStore is true, an already stored instance will be overwritten by the result
   */
  constructor(resource, action, ignoreStore = false) {
    this.resource = resource;
    this.action = action;
    this.ignoreStore = ignoreStore;
  }

  getResource() {
    return this.resource;
  }

  getAction() {
    return this.action;
  }

  ignoreStore() {
    return this.ignoreStore;
  }
}

/**
 * A Command represents an action on an instance or the root resource
 */
export default class Command {
  /**
   * if overwriteStore is true, an already stored instance will be ignored when processing the command
   */
  constructor(resource, action, overwriteStore = false) {
    this.resource = resource;
    this.action = action;
    this.overwriteStore = overwriteStore;
  }

  getResource() {
    return this.resource;
  }

  getAction() {
    return this.action;
  }

  ignoreStore() {
    return this.overwriteStore;
  }
}

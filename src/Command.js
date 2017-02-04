/**
 * A Command represents an action on an instance or the root resource
 */
export default class Command {
  constructor(resource, action) {
    this.resource = resource;
    this.action = action;
  }
}

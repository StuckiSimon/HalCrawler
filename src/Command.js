/**
 * A Command represents an action on an instance or the root resource
 */
export default class Command {
  constructor(resource, action, destinationSchema, body) {
    this.resource = resource;
    this.action = action;
    this.destinationSchema = destinationSchema;
    this.body = body;
  }

  getResource() {
    return this.resource;
  }

  getAction() {
    return this.action;
  }

  getDestinationSchema() {
    return this.destinationSchema === undefined ? this.getResource().getSchema() : this.destinationSchema;
  }

  getBody() {
    return this.body;
  }
}

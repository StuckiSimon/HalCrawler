/**
 * A Resource represents an instance of a Schema definition.
 */
export default class Resource {
  constructor(schema, data) {
    this.schema = schema;
    this.date = data;
  }

  getSchema() {
    return this.schema;
  }

  getData() {
    return this.data;
  }
}

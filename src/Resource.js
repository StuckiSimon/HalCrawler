/**
 * A Resource represents an instance of a Schema definition.
 */
export default class Resource {
  constructor(schema, link, data) {
    this.schema = schema;
    this.link = link;
    this.data = data;
  }

  getSchema() {
    return this.schema;
  }

  getLink() {
    return this.link;
  }

  getData() {
    return this.data;
  }

  isFetched() {
    return this.data !== undefined;
  }
}

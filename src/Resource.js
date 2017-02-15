import constants from "./constants";

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

  getChildLink(schema) {
    const links = this.getData()[constants.resource.links];
    if(links !== undefined) {
      const linkInstance = links[schema.getName()];
      if(linkInstance !== undefined) {
        return linkInstance;
      }
    }
    const embedded = this.getData()[constants.resource.embedded];
    const embeddedResource = embedded[schema.getName()];
    if(schema.getIdentifiers().length > 0) {
      return embeddedResource.map(embedded => embedded[constants.resource.links][constants.resource.self]);
    } else {
      return embeddedResource[constants.resource.links][constants.resource.self];
    }
  }

  getData() {
    return this.data;
  }

  isFetched() {
    return this.data !== undefined;
  }
}

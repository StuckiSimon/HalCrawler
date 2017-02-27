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
    const schemaDefinition = this.getSchema().getChildren().find(childSchema => Array.isArray(childSchema) ? childSchema[0] === schema : childSchema === schema);

    if(Array.isArray(schemaDefinition)) {
      return embeddedResource.map(embedded => embedded[constants.resource.links][constants.resource.self]);
    } else {
      return embeddedResource[constants.resource.links][constants.resource.self];
    }
  }

  getData() {
    return this.data;
  }

  isShallow() {
    const data = this.getData();
    return data[constants.crawlerInfoObject] === undefined ? false : data[constants.crawlerInfoObject]['shallow'];
  }

  isPending() {
    const promise = this.getPromise();
    return promise !== undefined && !promise.done;
  }

  getPromise() {
    const data = this.getData();
    return data[constants.crawlerInfoObject] === undefined ? undefined : data[constants.crawlerInfoObject]['promise'];
  }

  isNewerAs(resource) {
    const data = this.getData();
    return data[constants.crawlerInfoObject]['resourceRequestCount'] > resource.getData()[constants.crawlerInfoObject]['resourceRequestCount'];
  }

  // the state might be different
  isModellingSameResourceAs(resource) {
    const ownData = this.getData();
    const foreignData = resource.getData();
    if(this.getLink() === resource.getLink()) {
      return true;
    }
    const identifiers = this.getSchema().getIdentifiers();
    const unequalIdentifierInstance = identifiers.find(identifier => ownData[identifier] !== foreignData[identifier]);
    return unequalIdentifierInstance === undefined;
  }
}

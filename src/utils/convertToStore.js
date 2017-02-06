import Immutable from "immutable";
import constants from "../constants";
import Resource from "../Resource";
const createLinkData = (link) => {
  const newData = {};
  newData[constants.resource.links] = link;
  return newData;
};
const convertToStore = (schema, data, store) => {
  const embedded = data[constants.resource.embedded];
  const links = data[constants.resource.links];
  const resource = new Resource(schema, links[constants.resource.self], data);
  if (schema.getIdentifiers().length === 0) {
    // there is only one instance for given resource
    store = store.set(schema.getName(), resource);
  } else {
    const schemaInstances = store.get(schema.getName());
    if (schemaInstances === undefined) {
      store = store.set(schema.getName(), Immutable.Set([resource]));
    } else {
      const foundInstance = schemaInstances.find(instance => instance.getLink() === resource.getLink());
      if (foundInstance === undefined) {
        const schemaInstances = store.get(schema.getName(), Immutable.Set([]));
        store = store.updateIn([schema.getName()], schemas => schemas.add(resource));
      }
    }
  }
  schema.getChildren().forEach(childSchema => {
    // true if multiple instances of a given schema can occur on this level, false if only one can exist
    const isList = Array.isArray(childSchema);
    const actualSchema = isList ? childSchema[0] : childSchema;
    const embeddedSchema = embedded[actualSchema.getName()];
    if (embeddedSchema === undefined) {
      // there is no embedded data
      const link = links[actualSchema.getName()];
      if (link !== undefined) {
        // there is a link
        if (isList) {
          link.forEach(linkEntry => {
            store = convertToStore(actualSchema, createLinkData(linkEntry), store);
          });
        } else {
          store = convertToStore(actualSchema, createLinkData(linkEntry), store);
        }
      }
    } else {
      // there is embedded data
      if (isList) {
        embeddedSchema.forEach(embedded => {
          store = convertToStore(actualSchema, embedded, store);
        });
      } else {
        store = convertToStore(actualSchema, embeddedSchema, store);
      }
    }
  });
  return store;
};

export default convertToStore;

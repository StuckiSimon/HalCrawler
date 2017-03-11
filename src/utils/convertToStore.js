import Immutable from "immutable";
import constants from "../constants";
import Resource from "../Resource";

const resourceRequestCount = 0;

const createLinkData = (link) => {
  const newData = {};
  newData[constants.resource.links] = {};
  newData[constants.resource.links][constants.resource.self] = link;
  newData[constants.crawlerInfoObject] = {shallow: true};
  return newData;
};
const createEmbeddedData = (data) => {
  data[constants.crawlerInfoObject] = {shallow: false};
  return data;
};
const convertToStore = (schema, data, store) => {
  const embedded = data[constants.resource.embedded];
  const links = data[constants.resource.links];
  resourceRequestCount = resourceRequestCount + 1;
  if(!data[constants.crawlerInfoObject]) {
    data[constants.crawlerInfoObject] = {};
  }
  data[constants.crawlerInfoObject]['resourceRequestCount'] = resourceRequestCount;
  const resource = new Resource(schema, links === undefined ? undefined : links[constants.resource.self], data);
  if (!schema.isMultiInstanceSchema()) {
    // there is only one instance for given resource
    store = store.set(schema.getName(), resource);
  } else {
    const schemaInstances = store.get(schema.getName());
    if (schemaInstances === undefined) {
      store = store.set(schema.getName(), Immutable.Set([resource]));
    } else {
      const foundInstance = schemaInstances.find(instance => {
        return resource.isModellingSameResourceAs(instance);
      });
      if (foundInstance === undefined) {
        store = store.updateIn([schema.getName()], schemas => schemas.add(resource));
      } else {
        if(resource.isNewerAs(foundInstance)) {
          store = store.updateIn([schema.getName()], schemas => {
            schemas = schemas.delete(foundInstance);
            return schemas.add(resource);
          });
        }
      }
    }
  }
  // only if the self link exists a resource can be handled
  if(links) {
    schema.getChildren().forEach(childSchema => {
      // true if multiple instances of a given schema can occur on this level, false if only one can exist
      const isList = Array.isArray(childSchema);
      const actualSchema = isList ? childSchema[0] : childSchema;
      const embeddedSchema = embedded ? embedded[actualSchema.getName()] : undefined;
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
            store = convertToStore(actualSchema, createLinkData(link), store);
          }
        }
      } else {
        // there is embedded data
        if (isList) {
          embeddedSchema.forEach(embedded => {
            store = convertToStore(actualSchema, createEmbeddedData(embedded), store);
          });
        } else {
          store = convertToStore(actualSchema, createEmbeddedData(embeddedSchema), store);
        }
      }
    });
  }
  return store;
};

export default convertToStore;

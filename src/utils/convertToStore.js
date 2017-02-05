import Immutable from "immutable";
import constants from "../constants";
import Resource from "../Resource";

export default (schema, data, store) => {
  const embedded = data[constants.resource.embedded];
  const links = data[constants.resource.links];
  const resource = new Resource(schema, links[constants.resource.self], data);
  if (schema.getIdentifiers().length === 0) {
    // there is only one instance for given resource
    store = store.set(schema.getName(), resource);
  } else {
    const schemaInstances = store.get(schema.getName(), Immutable.Set([]));
    const foundInstance = schemaInstances.find(instance => instance.getLink() === resource.getLink());
    if (foundInstance === undefined) {
      store = store.updateIn([schema.getName()], schemas => schemas.push(resource));
    }
  }
  schema.getChildren().forEach(childSchema => {
    const embeddedSchema = embedded[childSchema.getName()];
    if (embeddedSchema === undefined) {
      const link = links[childSchema.getName()];

    } else {
      convertToStore(childSchema, embeddedSchema, store);
    }
  });
  return store;
};

export default (store, schema, resource) => {
  // find resources for given schema in store
  const storeLocation = store[schema.getName()];

  if (storeLocation === undefined) {
    // no element of this type has already been loaded
    return undefined;
  }
  // the element could be here
  if (schema.getIdentifiers().length === 0) {
    // there is only one instance for given resource (e.g. root)
    return storeLocation;
  } else {
    // there can be multiple instances for given resource
    const foundResource = storeLocation.find(currentResource => currentResource.getLink() === resource.getLink());
    if (foundResource === undefined) {
      return undefined;
    } else {
      // Only return the found resource if it's not an empty resource
      return foundResource.getData() === undefined ? undefined : foundResource;
    }
  }
};

/**
 * loads a given resource from the store
 * @param  Immutable.Map store    Location of the Resource
 * @param  Resource resource Resource without data (must contain link)
 * @return Resource          Resource with data
 */
export default (store, resource) => {
  const schema = resource.getSchema();
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

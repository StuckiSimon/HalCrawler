/**
 * loads a given resource from the store
 * @param  Immutable.Map store    Location of the Resource
 * @param  Resource resource Resource without data (must contain link or filled in identifiers)
 * @return Resource          Resource with data
 */
export default (store, resource) => {
  const schema = resource.getSchema();
  // find resources for given schema in store
  const storeLocation = store.get(schema.getName());

  if (storeLocation === undefined) {
    // no element of this type has already been loaded
    return undefined;
  }
  // the element could be here
  if (schema.getIdentifiers().length === 0) {
    // there is only one instance for given resource (e.g. root)
    return storeLocation;
  } else {
    const link = resource.getLink();
    let findCallback = currentResource => {
      const linksMatch = currentResource.getLink() === resource.getLink();
      const data = currentResource.getData();
      const notDefinedIdentifier = schema.getIdentifiers().find(identifier => data[identifier] === undefined);
      return linksMatch && notDefinedIdentifier === undefined;
    };
    if(link === undefined) {
      const identifiers = schema.getIdentifiers();
      const data = resource.getData();
      findCallback = currentResource => {
        const currentData = currentResource.getData();
        // find where it doesn't match
        const different = identifiers.find(identifier => {
          return currentData[identifier] !== data[identifier] && data[identifier] !== undefined;
        });
        if(different === undefined) {
          return true;
        } else {
          return false;
        }
      };
    }
    // there can be multiple instances for given resource
    const foundResource = storeLocation.find(findCallback);
    if (foundResource === undefined) {
      return undefined;
    } else {
      // Only return the found resource if it's not an empty resource
      return foundResource.getData() === undefined ? undefined : foundResource;
    }
  }
};

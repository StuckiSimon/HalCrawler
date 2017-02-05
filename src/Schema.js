/**
 * A Schema represents any endpoint of a given HAL API.
 * This might be a GET, but could also be a POST / PUT / DELETE endpoint
 */
export default class Schema {
  /**
   *
   * @param  string name        will be used as a unique identifier for a schema (there must never be multiple schemas with the same name)
   * @param  [string] identifiers an array of strings which defines the attributes required to uniquely define a resource
   * @param  Action action     the action which can be performed on an endpoint
   * @param  [Schema] children    defines the schemas underneath the parent schema
   * @return undefined
   */
  constructor(name, identifiers, action, children) {
    this.name = name;
    this.identifiers = identifiers;
    this.action = action;
    this.children = children || [];
  }

  getName() {
    return this.name;
  }

  getIdentifiers() {
    return this.identifiers;
  }

  getAction() {
    return this.action;
  }

  getChildren() {
    return this.children;
  }

}

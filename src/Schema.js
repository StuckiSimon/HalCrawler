import action from './action';
import schemaType from './schemaType';

/**
 * A Schema represents any endpoint of a given HAL API.
 * This might be a GET, but could also be a POST / PUT / DELETE endpoint
 */
export default class Schema {
  /**
   *
   * @param  string name        will be used as a unique identifier for a schema (there must never be multiple schemas with the same name)
   * @param  string[] identifiers or linkIdentifiedResource or singleInstanceResource
   *                              an array of strings which defines the attributes required to uniquely define a resource
   *                              or schemaType.linkIdentifiedResource (default) if there are multiple instances but there are no unique attributes on a resource
   *                              or schemaType.singleInstanceResource if there is only one instance of the resource in the state
   * @param  Action[] actions     the actions which can be performed on an endpoint, if undefined only GET actions are configured
   * @param  Schema[] children    defines the schemas underneath the parent schema, is optional
   * @return Schema definition instance
   */
  constructor(name, identifiers, actions, children) {
    this.name = name;
    this.identifiers = identifiers || linkIdentifiedResource;
    this.actions = actions || [action.GET];
    this.children = children || [];
  }

  getName() {
    return this.name;
  }

  getIdentifiers() {
    return this.identifiers;
  }

  getActions() {
    return this.actions;
  }

  getChildren() {
    return this.children;
  }

  addChild(newChild) {
    this.children.push(newChild);
  }

  isMultiInstanceSchema() {
    return this.getIdentifiers() !== schemaType.singleInstanceResource;
  }

}

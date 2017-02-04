/**
 * A Schema represents any endpoint of a given HAL API.
 * This might be a GET, but could also be a POST / PUT / DELETE endpoint
 */
export default class Schema {
  /**
   *
   */
  constructor(name, identifiers, actions, children) {
    this.name = name;
    this.identifiers = identifiers;
    this.actions = actions;
    this.children = children;
  }
}

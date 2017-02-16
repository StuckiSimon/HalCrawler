import { Resource, action, Schema } from '../src/';
import constants from '../src/constants';

const authorLink = 'author1.json';

const authors = new Schema('authors', ['id'], action.GET);
const books = new Schema('books', ['id'], action.GET, [authors]);

const createDummyLinkedData = () => {
  const book = {
  };
  book[constants.resource.links] = {
    authors: {
      href: authorLink
    }
  };
  return book;
};

const createDummyEmbeddedData = () => {
  const book = {
  };
  const embedded = book[constants.resource.embedded] = {
    authors: {

    }
  };
  embedded.authors[constants.resource.links] = {

  };
  embedded.authors[constants.resource.links][constants.resource.self] = {
    href: authorLink
  };
  return book;
};

const createDummyLinkedResource = () => new Resource(books, undefined, createDummyLinkedData());
const createDummyEmbeddedResource = () => new Resource(books, undefined, createDummyEmbeddedData());

describe('Resource', function() {

  it('should find links which are referred', function() {
    const resource = createDummyLinkedResource();
    expect(resource.getChildLink(authors).href).toEqual(authorLink);
  });

  it('should find links which are embedded', function() {
    const resource = createDummyEmbeddedResource();
    expect(resource.getChildLink(authors).href).toEqual(authorLink);
  });

});

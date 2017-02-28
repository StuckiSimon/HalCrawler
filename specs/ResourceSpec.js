import { Resource, action, Schema } from '../src/';
import constants from '../src/constants';
import { authors, books } from './schemas';

const authorLink = 'author1.json';

const authorsData = {

}

authorsData[constants.resource.links] = {

};
authorsData[constants.resource.links][constants.resource.self] = {
  href: authorLink
};

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
    authors: authorsData
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

  it('should find data which is embedded', function() {
    const resource = createDummyEmbeddedResource();
    expect(resource.getChildData(authors)).toEqual(authorsData);
  });

});

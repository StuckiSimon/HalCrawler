import Immutable from "immutable";
import convertToStore from '../../src/utils/convertToStore';
import { authors, books } from '../schemas';

describe('convertToStore helper', function() {

  it('must convert a simple valid resource to a store representation', function() {
    const store = convertToStore(authors, {
      _links: {
        self: {
          href: 'self.json'
        }
      }
    }, Immutable.Map());
  });

});

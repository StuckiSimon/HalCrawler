import { createConfig } from '../src/';

describe('createConfig helper', function() {

  it('should accept a valid configuration', function() {
    const config = createConfig({root: 'endpoint.json'});
    expect(config).toBeTruthy();
  });

  it('should reject an invalid configuration', function() {
    expect(createConfig).toThrow();
  });

  it('should reject an empty configuration', function() {
    expect(createConfig.bind(this, {})).toThrow();
  });

});

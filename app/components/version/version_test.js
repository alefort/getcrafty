'use strict';

describe('getCrafty.version module', function() {
  beforeEach(module('getCrafty.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});

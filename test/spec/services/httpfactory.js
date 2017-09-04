'use strict';

describe('Service: httpFactory', function () {

  // load the service's module
  beforeEach(module('lunchBoxApp'));

  // instantiate service
  var httpFactory;
  beforeEach(inject(function (_httpFactory_) {
    httpFactory = _httpFactory_;
  }));

  it('should do something', function () {
    expect(!!httpFactory).toBe(true);
  });

});

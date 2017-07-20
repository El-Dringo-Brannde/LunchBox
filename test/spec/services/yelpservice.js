'use strict';

describe('Service: yelpService', function () {

  // load the service's module
  beforeEach(module('lunchBoxApp'));

  // instantiate service
  var yelpService;
  beforeEach(inject(function (_yelpService_) {
    yelpService = _yelpService_;
  }));

  it('should do something', function () {
    expect(!!yelpService).toBe(true);
  });

});

'use strict';

describe('Service: requestFoodService', function () {

  // load the service's module
  beforeEach(module('lunchBoxApp'));

  // instantiate service
  var requestFoodService;
  beforeEach(inject(function (_requestFoodService_) {
    requestFoodService = _requestFoodService_;
  }));

  it('should do something', function () {
    expect(!!requestFoodService).toBe(true);
  });

});

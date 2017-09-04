'use strict';

describe('Service: regexService', function () {

  // load the service's module
  beforeEach(module('lunchBoxApp'));

  // instantiate service
  var regexService;
  beforeEach(inject(function (_regexService_) {
    regexService = _regexService_;
  }));

  it('should do something', function () {
    expect(!!regexService).toBe(true);
  });

});

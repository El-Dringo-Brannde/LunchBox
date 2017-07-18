'use strict';

describe('Service: commService', function () {

  // load the service's module
  beforeEach(module('lunchBoxApp'));

  // instantiate service
  var commService;
  beforeEach(inject(function (_commService_) {
    commService = _commService_;
  }));

  it('should do something', function () {
    expect(!!commService).toBe(true);
  });

});

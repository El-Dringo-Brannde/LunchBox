'use strict';

describe('Service: pictureService', function () {

  // load the service's module
  beforeEach(module('lunchBoxApp'));

  // instantiate service
  var pictureService;
  beforeEach(inject(function (_pictureService_) {
    pictureService = _pictureService_;
  }));

  it('should do something', function () {
    expect(!!pictureService).toBe(true);
  });

});

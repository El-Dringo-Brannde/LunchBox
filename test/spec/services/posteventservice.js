'use strict';

describe('Service: postEventService', function () {

  // load the service's module
  beforeEach(module('lunchBoxApp'));

  // instantiate service
  var postEventService;
  beforeEach(inject(function (_postEventService_) {
    postEventService = _postEventService_;
  }));

  it('should do something', function () {
    expect(!!postEventService).toBe(true);
  });

});

'use strict';

describe('Service: joinGroupService', function () {

  // load the service's module
  beforeEach(module('lunchBoxApp'));

  // instantiate service
  var joinGroupService;
  beforeEach(inject(function (_joinGroupService_) {
    joinGroupService = _joinGroupService_;
  }));

  it('should do something', function () {
    expect(!!joinGroupService).toBe(true);
  });

});

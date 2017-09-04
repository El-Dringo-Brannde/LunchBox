'use strict';

describe('Service: profileHttp', function () {

  // load the service's module
  beforeEach(module('lunchBoxApp'));

  // instantiate service
  var profileHttp;
  beforeEach(inject(function (_profileHttp_) {
    profileHttp = _profileHttp_;
  }));

  it('should do something', function () {
    expect(!!profileHttp).toBe(true);
  });

});

'use strict';

describe('Service: animationService', function () {

  // load the service's module
  beforeEach(module('lunchBoxApp'));

  // instantiate service
  var animationService;
  beforeEach(inject(function (_animationService_) {
    animationService = _animationService_;
  }));

  it('should do something', function () {
    expect(!!animationService).toBe(true);
  });

});

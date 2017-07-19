'use strict';

describe('Service: lunchservice', function () {

  // load the service's module
  beforeEach(module('lunchBoxApp'));

  // instantiate service
  var lunchservice;
  beforeEach(inject(function (_lunchservice_) {
    lunchservice = _lunchservice_;
  }));

  it('should do something', function () {
    expect(!!lunchservice).toBe(true);
  });

});

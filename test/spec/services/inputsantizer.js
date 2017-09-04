'use strict';

describe('Service: inputSantizer', function () {

  // load the service's module
  beforeEach(module('lunchBoxApp'));

  // instantiate service
  var inputSantizer;
  beforeEach(inject(function (_inputSantizer_) {
    inputSantizer = _inputSantizer_;
  }));

  it('should do something', function () {
    expect(!!inputSantizer).toBe(true);
  });

});

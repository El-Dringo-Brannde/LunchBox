'use strict';

describe('Service: toastr', function () {

  // load the service's module
  beforeEach(module('lunchBoxApp'));

  // instantiate service
  var toastr;
  beforeEach(inject(function (_toastr_) {
    toastr = _toastr_;
  }));

  it('should do something', function () {
    expect(!!toastr).toBe(true);
  });

});

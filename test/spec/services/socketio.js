'use strict';

describe('Service: socketIO', function () {

  // load the service's module
  beforeEach(module('lunchBoxApp'));

  // instantiate service
  var socketIO;
  beforeEach(inject(function (_socketIO_) {
    socketIO = _socketIO_;
  }));

  it('should do something', function () {
    expect(!!socketIO).toBe(true);
  });

});

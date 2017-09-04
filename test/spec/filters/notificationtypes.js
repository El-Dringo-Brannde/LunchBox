'use strict';

describe('Filter: notificationTypes', function () {

  // load the filter's module
  beforeEach(module('lunchBoxApp'));

  // initialize a new instance of the filter before each test
  var notificationTypes;
  beforeEach(inject(function ($filter) {
    notificationTypes = $filter('notificationTypes');
  }));

  it('should return the input prefixed with "notificationTypes filter:"', function () {
    var text = 'angularjs';
    expect(notificationTypes(text)).toBe('notificationTypes filter: ' + text);
  });

});

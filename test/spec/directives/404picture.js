'use strict';

describe('Directive: 404Picture', function () {

  // load the directive's module
  beforeEach(module('lunchBoxApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<404-picture></404-picture>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the 404Picture directive');
  }));
});

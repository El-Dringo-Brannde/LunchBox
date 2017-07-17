'use strict';

/**
 * @ngdoc function
 * @name lunchBoxApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the lunchBoxApp
 */
angular.module('lunchBoxApp')
   .controller('loginController', function($scope) {
      this.awesomeThings = [
         'HTML5 Boilerplate',
         'AngularJS',
         'Karma'
      ];
      $scope.foo = "Fart"
   });
'use strict';

/**
 * @ngdoc function
 * @name lunchBoxApp.controller:BasecontrollerCtrl
 * @description
 * # BasecontrollerCtrl
 * Controller of the lunchBoxApp
 */
angular.module('lunchBoxApp')
   .controller('baseController', function($scope, commService) {
      $scope.userLogin = false
      $scope.foo = "kjhasdf"
      console.log(commService.get())
   });
'use strict';

/**
 * @ngdoc function
 * @name lunchBoxApp.controller:BasecontrollerCtrl
 * @description
 * # BasecontrollerCtrl
 * Controller of the lunchBoxApp
 */
angular.module('lunchBoxApp')
   .controller('baseController', function($scope, $rootScope) {
      $scope.userLogin = false
      $rootScope.$on("showNav", function() {
         $scope.userLogin = true;
      });
      $rootScope.$on("hideNav", function() {
         $scope.userLogin = false;
      });

      console.log($scope.userLogin)
   });
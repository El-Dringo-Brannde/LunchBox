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
      //Handles hide and show nav
      $scope.userLogin = false;
      $rootScope.$on("showNav", function() {
         $scope.userLogin = true;
      });
      $rootScope.$on("hideNav", function() {
         $scope.userLogin = false;
      });
   });
'use strict';

/**
 * @ngdoc function
 * @name lunchBoxApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the lunchBoxApp
 */
const zomatoKey = "e52fff3091a307dca21f7c48b4796345";
angular.module('lunchBoxApp')
   .controller('MainCtrl', function($scope, $cookies, $window, commService) {
      if ($cookies.get("user") == undefined) {
         alert("You have been logged out!")
         $window.location.href = '/#/login';
      }
      var userName;
      commService.get().name == undefined ? userName = $cookies.get("user") :
         userName = commService.get().name
      $scope.user = userName.split(",").pop()
      $scope.user != null ? $scope.userLogin : false
   });
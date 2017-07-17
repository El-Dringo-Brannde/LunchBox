'use strict';

/**
 * @ngdoc function
 * @name lunchBoxApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the lunchBoxApp
 */
angular.module('lunchBoxApp')
   .controller('MainCtrl', function($cookies, $window) {
      console.log($cookies.get("user"))
      if ($cookies.get("user") == undefined) {
         alert("You have been logged out!")
         $window.location.href = '/#/login';

      }

   });
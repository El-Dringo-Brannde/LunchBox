/*global alert*/

'use strict';

/**
 * @ngdoc service
 * @name lunchBoxApp.navbar
 * @description
 * # navbar
 * Service in the lunchBoxApp.
 */
angular.module('lunchBoxApp')
   .service('navbar', function($cookies, $window, $rootScope, commService) {
      var navBarInit = function() {
         if (!$cookies.get("user")) {
            alert("Please log in before using LunchBox.");
            $window.location.href = 'http://api-int.connectcdk.com/api/dm-cto-lunch-box-ui/v1/#/login';
         }
         var username;
         if (!commService.get().name) {
            username = $cookies.get("user");
         } else {
            username = commService.get().name;
         }
         $rootScope.$broadcast("showNav");
      };
      return navBarInit;
   });
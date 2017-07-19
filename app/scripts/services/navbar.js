'use strict';

/**
 * @ngdoc service
 * @name lunchBoxApp.navbar
 * @description
 * # navbar
 * Service in the lunchBoxApp.
 */
angular.module('lunchBoxApp')
   .service('navbar', function($rootScope, $cookies, $window, commService) {
      // AngularJS will instantiate a singleton by calling "new" on this function
      var navBarInit = function() {
         if ($cookies.get("user") == undefined) {
            alert("You have been logged out!")
            $window.location.href = '/#/login';
         }
         var userName;
         commService.get().name == undefined ? userName = $cookies.get("user") :
            userName = commService.get().name
         $rootScope.$broadcast("showNav")
      }
      return navBarInit
   });
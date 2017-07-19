/* global alert */

'use strict';

/**
 * @ngdoc function
 * @name lunchBoxApp.controller: profileController
 * @description
 * # profileController
 * Controller of the lunchBoxApp for the profile page
 */
angular.module('lunchBoxApp')
   .controller('profileController', function ($scope, $http, $cookies, $window, commService, $rootScope) {
      $scope.personSearch = "";
      $scope.restaurantSearch = "";
   });

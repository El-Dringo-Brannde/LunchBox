'use strict';

/**
 * @ngdoc overview
 * @name lunchBoxApp
 * @description
 * # lunchBoxApp
 *
 * Main module of the application.
 */
angular
   .module('lunchBoxApp', [
      'ngCookies',
      'ngResource',
      'ngRoute',
      'ngSanitize',
      'ngTouch'
   ])
   .config(function($routeProvider, $locationProvider) {
      $routeProvider
         .when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl',
            controllerAs: 'main'
         })
         .when("/login", {
            templateUrl: 'views/login.html',
            controller: 'loginController',
            controllerAs: 'login'
         })
         .when("/profile", {
            templateUrl: 'views/profile.html',
            controller: 'ProfileCtrl',
            controllerAs: 'profile'
         })
         .otherwise({
            redirectTo: '/api/dm-cto-lunch-box-ui/v1/#/login'
         });
      $locationProvider.hashPrefix('');
   });
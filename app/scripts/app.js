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
      'ngAnimate',
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
         .when('/about', {
            templateUrl: 'views/about.html',
            controller: 'AboutCtrl',
            controllerAs: 'about'
         })
         .when("/login", {
            templateUrl: 'views/login.html',
            controller: 'loginController',
            controllerAs: 'login'
         })
         .otherwise({
            redirectTo: '/'
         });
      $locationProvider.hashPrefix('');
   });
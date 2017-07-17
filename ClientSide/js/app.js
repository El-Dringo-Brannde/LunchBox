'use strict';

var app = angular.module('lunchBoxApp', ['ngRoute', 'ngCookies']);

app.config(['$routeProvider', 
   function($routeProvider) {
      console.log("foo")
      $routeProvider.
      when('/login', {
         templateUrl: 'login.html',
         controller: 'loginController'
      })
   }
]);
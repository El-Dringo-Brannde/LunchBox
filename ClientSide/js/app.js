'use strict';

var app = angular.module('lunchBoxApp', ['ngRoute']);

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
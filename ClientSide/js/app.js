angular
   .module('lunchBoxApp', [
      'ngRoute'
   ])
   .config(function($routeProvider) {
      console.log("ksdjfkl")
      $routeProvider
         .when('/home', {
            templateUrl: '/html/home.html',
            controller: 'MainController'
         })
         .when('/login', {
            templateUrl: '/html/login.html',
            controller: 'loginController'
         })
   })
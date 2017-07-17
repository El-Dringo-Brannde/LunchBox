
   angular
      .module('lunchBoxApp', [
         'ngRoute'
      ])
      .config(function ($routeProvider) {
         $routeProvider
            .when('/home', {
               templateUrl: '/html/home.html',
               controller: 'MainController'
            })
            .when('/login', {
               templateUrl: '/html/login.html',
               controller: 'loginController'
            })
            .otherwise({
               redirectTo: '/login'
            })
      })
}
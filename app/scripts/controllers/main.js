'use strict';

/**
 * @ngdoc function
 * @name lunchBoxApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the lunchBoxApp
 */
const zomatoKey = "e52fff3091a307dca21f7c48b4796345";
angular.module('lunchBoxApp')
   .controller('MainCtrl', function($scope, $cookies, $http, $window, commService) {
      if ($cookies.get("user") == undefined) {
         alert("You have been logged out!")
         $window.location.href = '/#/login';
      }
      var userName;
      commService.get().name == undefined ? userName = $cookies.get("user") :
         userName = commService.get().name
      $scope.user = userName.split(",").pop()
      $scope.name = 'Base Camp Brewery'
      $scope.searchFood = 
         $http({
            method: 'GET',
            headers: {
               "user-key": "e52fff3091a307dca21f7c48b4796345"
            },
            url: 'https://developers.zomato.com/api/v2.1/search?entity_type=city&q=Base%20Camp%20Brewery&lat=45.5008823&lon=-122.6777504&radius=10000&sort=rating'
         }).then(function success(response){
            console.log(response.data)
         }, function error(respone){
            console.log(respone)
         });
   });
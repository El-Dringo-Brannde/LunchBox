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
  .controller('MainCtrl', function ($scope, $cookies, $http, $window, commService) {
    if ($cookies.get("user") == undefined) {
      alert("You have been logged out!")
      $window.location.href = '/#/login';
    }
    var userName;
    commService.get().name == undefined ? userName = $cookies.get("user") :
      userName = commService.get().name
    $scope.user = userName.split(",").pop()
    $scope.name = 'Base Camp Brewing'
    $scope.restaurantData = []
    $scope.getFood =
      $http({
        method: 'GET',
        headers: {
          'user-key': zomatoKey
        },
        url: "https://developers.zomato.com/api/v2.1/search?q='" + $scope.name + "entity_type=city&lat=45.5008823&lon=-122.6777504&radius=10000&sort=rating",
        // data: {
        //    entity_type: 'city',
        //    lat: '45.5008823',
        //    lon: '-122.6777504',
        //    radius: '10000',
        //    sort: 'rating'
        // }
      }).then(function success(response) {
        console.log(response)
        for (var i = 0; i < response.data.restaurants.length; i++) {
          if (response.data.restaurants[i].restaurant.name == $scope.name) {
            console.log('Found!')
            $scope.restaurantData(response.data.restaurants[i].restaurant)
            break
          }
        }
      }, function error(respone) {
        console.log(respone)
      });

      $scope.restaurantData = function(restaurant){
         $scope.restName = restaurant.name;
         $scope.restMenu = restaurant.menu_url;
         $scope.restAddress = restaurant.location.address
      }
  });

//global variables go here to suppress warnings
/*global alert*/

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
  .controller('MainCtrl', function ($scope, $cookies, $http, $window, commService, $rootScope) {
    if ($cookies.get("user") == undefined) {
      alert("You have been logged out!")
      $window.location.href = '/#/login';
      $rootScope.$broadcast("hideNav") 
    }
   $rootScope.$broadcast("showNav") 
    var userName;
    commService.get().name == undefined ? userName = $cookies.get("user") :
      userName = commService.get().name
    $scope.user = userName.split(",").pop()
    $scope.name = 'Base Camp Brewing'
    $scope.getFood =
      $http({
        method: 'GET',
        headers: {
          'user-key': zomatoKey
        },
        url: "https://developers.zomato.com/api/v2.1/search?q='" + $scope.name + "entity_type=city&lat=45.5008823&lon=-122.6777504&radius=10000&sort=rating",
      }).then(function success(response) {
        for (var i = 0; i < response.data.restaurants.length; i++) {
          if (response.data.restaurants[i].restaurant.name == $scope.name) {
            console.log(response.data.restaurants[i].restaurant)
             $scope.restaurant = response.data.restaurants[i].restaurant
             $scope.groupLunch.location.name = $scope.restaurant.name
             $scope.groupLunch.location.addr = $scope.restaurant.location.address
             $scope.groupLunch.location.menu = $scope.restaurant.menu_url

             $scope.groupLunch.extra.rating = $scope.restaurant.user_rating.aggregate_rating
             $scope.groupLunch.extra.cuisine = $scope.restaurant.cuisines
             break
          }
        }
      }, function error(respone) {
        alert('Restaurant not found')
      });
      
      console.log($scope.getRestaurantInfo)
      $scope.groupLunch = {
         userName: 'Devin',
         peopleGoing: '10',
         travelMethod: 'fa fa-car',
         time: '12:30',
         location: {
           name: "",
           menu: "",
           addr: ""
         },
         extra: {
          rating: "",
          cuisine: ""
         }
      }
      $scope.showInfo = false;
      $scope.loadDetails = function(lunchDetails){
        console.log("poopoo")
        $scope.showInfo = true;
      }
  });

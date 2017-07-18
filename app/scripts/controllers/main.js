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
  .controller('MainCtrl', function ($scope, $cookies, $http, $window, $rootScope, commService, lunchservice) {
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
            $scope.tmpData[0].location.name = $scope.restaurant.name
            $scope.tmpData[0].location.addr = $scope.restaurant.location.address
            $scope.tmpData[0].location.menu = $scope.restaurant.menu_url

            $scope.tmpData[0].extra.rating = $scope.restaurant.user_rating.aggregate_rating
            $scope.tmpData[0].extra.cuisine = $scope.restaurant.cuisines
            break
          }
        }
      }, function error(respone) {
        alert('Restaurant not found')
      });
    
    $scope.tmpData = [{
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
    }, {
      userName: 'Poop',
      peopleGoing: '420',
      travelMethod: 'fa fa-car',
      time: '1:30',
      location: {
        name: "SUPER POOP",
        menu: "no",
        addr: "420 NoSko0pz Ln"
      },
      extra: {
        rating: "1",
        cuisine: "Blaze it"
      }
    }]
    $scope.showInfo = false;
    $scope.loadGroup = function(group){
      $scope.showInfo = true;
      $scope.group = lunchservice.loadDetails(group)
    } 
  });

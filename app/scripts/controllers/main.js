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
    $scope.activeUsers = []
    $scope.usersGoing = []

    $scope.getActiveUsersHTTP =
      $http({
        method: 'GET',
        url: 'http://localhost:3005/getActiveUsers'
      }).then(function success(response) {
        console.log(response.data)
        for (var i = 0; i < response.data.length; i++) {
          if (response.data[i].where !== "") {
            $scope.activeUsers.push(response.data[i])
            $scope.activeUsers[i].peopleGoing = $scope.activeUsers[i].peopleGoing.length
          }
        }
      }, function error(respone) {
        alert('active users not found')
      });
    console.log($scope.activeUserRestaurants)
    console.log($scope.usersGoing)
    $scope.httpResults = []
    $scope.makeHttpCall = function (restaurantName) {
      $http({
        method: 'GET',
        headers: {
          'user-key': zomatoKey,
        },
        url: "https://developers.zomato.com/api/v2.1/search?q='" + restaurantName + "entity_type=city&lat=45.5008823&lon=-122.6777504&radius=10000&sort=rating",
      }).then(function success(response) {
        console.log(response)
        for (var i = 0; i < response.data.restaurants.length; i++) {
          if (response.data.restaurants[i].restaurant.name == restaurantName) {
            console.log(response.data.restaurants[i].restaurant.name)
            $scope.httpResults = response.data.restaurants[i].restaurant
            console.log($scope.httpResults)
            break
          }
        }
      }, function error(respone) {
        alert('Restaurant not found')
      });
    }

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
        rating: "1hundit",
        cuisine: "Blaze it"
      }
    }]
    $scope.showInfo = false;
    $rootScope.$on("dataPopulated", function(){
      $scope.showInfo = true
    }) 
    $scope.loadGroup = function (group) {
      $scope.makeHttpCall(group.where);
      console.log($scope.httpResults)
      $scope.group = lunchservice.loadDetails(group, $scope.httpResults)
    }
    $scope.makeHttpCall('Base Camp Brewing');
  });

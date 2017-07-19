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
   .controller('MainCtrl', function($scope, $cookies, $http, $window, $rootScope, commService, lunchservice) {
      if ($cookies.get("user") == undefined) {
         alert("You have been logged out!")
         $window.location.href = '/#/login';
         $rootScope.$broadcast("hideNav")
      }
      $rootScope.$broadcast("showNav")
      var userName;
      commService.get().name == undefined ? userName = $cookies.get("user") : userName = commService.get().name
      $scope.user = userName.split(",").pop()
      $scope.activeUsers = []

      $scope.getActiveUsersHTTP =
         $http({
            method: 'GET',
            url: 'http://localhost:3005/getActiveUsers'
         }).then(function success(response) {
            console.log(response.data)
            for (var i = 0; i < response.data.length; i++) {
               if (response.data[i].where !== "") {
                  $scope.activeUsers.push(response.data[i])
                  $scope.activeUsers[i].peopleGoing = $scope.activeUsers[i].peopleGoing
                  $scope.activeUsers[i].peopleGoingCount = $scope.activeUsers[i].peopleGoing.length
               }
            }
         });

      $scope.httpResults = []
      $scope.makeHttpCall = function(restaurantName) {
         $http({
            method: 'GET',
            headers: {
               'user-key': zomatoKey,
            },
            url: "https://developers.zomato.com/api/v2.1/search?q='" + restaurantName + "'entity_type=city&lat=45.5008823&lon=-122.6777504&radius=10000&sort=rating",
         }).then(function success(response) {
            console.log(response)
            for (var i = 0; i < response.data.restaurants.length; i++) {
               if (response.data.restaurants[i].restaurant.name == restaurantName) {
                  $scope.httpResults = response.data.restaurants[i].restaurant
                  console.log($scope.httpResults)
                  break
               }
            }
         });
      }
      $scope.canJoin = true;
      $scope.plusOne = function(group) {
         console.log(group)
         for (var i = 0; i < group.peopleGoing.length; i++) {
            if (group.peopleGoing[i] == $cookies.getObject("user").username) {
               console.log(group.peopleGoing[i] + " vs " + $cookies.getObject("user").username)
               console.log("already joined")
               $scope.canJoin = false
               $scope.isActive = function() {
                  return true
               };
            }
         }
         if ($scope.canJoin == true) {
            $http({
               method: "PUT",
               url: 'http://localhost:3005/personGoing',
               data: {
                  name: group.username,
                  personGoing: $cookies.getObject("user").username
               }
            }).then(function success(response) {
               group.peopleGoingCount += 1
               group.peopleGoing.push($cookies.getObject("user").username)
            })
            $scope.isActive = function() {
               return true;
            };
         }


         $scope.showInfo = false;
         $rootScope.$on("dataPopulated", function() {
            $scope.showInfo = true
         })
         $scope.loadGroup = function(group) {
            console.log(group.where)
            $scope.makeHttpCall(group.where);
            console.log($scope.httpResults)
            $scope.group = lunchservice.loadDetails(group, $scope.httpResults)
         }
      }
   });
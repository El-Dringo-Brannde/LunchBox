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
  .controller('MainCtrl', function ($scope, $cookies, $http, $window,
    $rootScope, commService, lunchservice, navbar, toastr, groupService) {
    var baseUrl = "http://localhost:3005/";

    navbar()
    var userName;
    commService.get().name == undefined ? userName = $cookies.getObject("user").username : userName = commService.get().username
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
    
    $scope.makeHttpCall = function (restaurantName) {
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
          }
        }
      });
    }

    $scope.canJoin = true;
    $scope.plusOne = function (group) {
      for (var i = 0; i < group.peopleGoing.length; i++) {
        console.log($cookies.getObject("user"))
        if (group.peopleGoing[i] == $cookies.getObject("user").name) {
          $scope.canJoin = false
          toastr()
          $scope.isActive = function () {
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
            personGoing: $cookies.getObject("user").name
          }
        }).then(function success(response) {
          group.peopleGoingCount += 1
          group.peopleGoing.push($cookies.getObject("user").name)
        })
        $scope.isActive = function () {
          return true;
        };
      }
      $scope.showInfo = false;
      $rootScope.$on("dataPopulated", function () {
        $scope.showInfo = true
      })
      $scope.loadGroup = function (group) {
        console.log(group.where)
        $scope.makeHttpCall(group.where);
        console.log($scope.httpResults)
        $scope.group = lunchservice.loadDetails(group, $scope.httpResults)
      }
    }
    $scope.showForm = true;
    $scope.moreInfo = function(group){
      $scope.showForm = false;
      $scope.groupDetails = groupService.groupDetails(group)
    }

    $scope.createEvent = function () {
      //assign to temp variables for easy readibility
      var name = $scope.restaurant.name,
        address = $scope.restaurant.address,
        time = $scope.time,
        transport = $scope.transport;

      if (name === "" || address === "" || time === "" || transport === "") {
        $scope.submissionError = "Error, all fields are required for creating an event";
      } else {
        //reset the submission error message if all fields are there
        $scope.submissionError = "";

        //TODO: some validation before the object is created

        var submissionObject = {
          //get the username from whatever thing is keeping the user logged in
          username: 'moort',
          restaurant: {
            name: name,
            address: address
          },
          time: time,
          travelMethod: transport
        };
        console.log(submissionObject)
        $scope.request = $http.put(baseUrl + "goingSomewhere", submissionObject)
          .then(function success(response) {
              console.log(response)
              //clear all the input fields after the data has been put in the database
              $scope.restaurant.name = "";
              $scope.restaurant.address = "";
              $scope.time = "";
              $scope.tranport = "";
            },
            function failiure(response) {
              console.log("there was an error posting the data");
              $scope.submissionError = "there was an error posting the data";
            });
      }
    }
  });

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
   .controller('MainCtrl', function($scope, $cookies, $window, commService, $rootScope, $http, navbar) {
      navbar()
      var baseUrl = "http://localhost:3005/";

      if ($cookies.get("user") == undefined) {
         alert("You have been logged out!");
         $window.location.href = '/#/login';
      }
      var userName;
      if (commService.get().name === undefined) {
         userName = $cookies.get("user");
      } else {
         userName = commService.get().name;
      }
      $scope.user = userName.split(",").pop()
      $scope.user != null ? $scope.userLogin : false
      $rootScope.$broadcast("showNav");


      //init all the form items to be empty
      $scope.restaurant = {};
      $scope.restaurant.name = "";
      $scope.restaurant.address = "";
      $scope.time = "";
      $scope.tranport = "";

      $scope.submissionError = "";


      //the createEvent function is called on form submission
      $scope.createEvent = function() {
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

               //uncomment this when the cookie is properly set
               //username: $cookies.get("user").userName,

               //hardcoded value
               username: "dringb",
               restaurant: {
                  name: name,
                  address: address
               },
               time: time,
               travelMethod: transport
            };

            console.log(submissionObject);

            $scope.request = $http.put(baseUrl + "goingSomewhere", submissionObject).then(function success(response) {

                  console.log(response);

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
      };
   });
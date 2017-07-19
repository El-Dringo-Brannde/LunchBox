//global variables go here to suppress warnings
/*global alert, $*/

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
   .controller('MainCtrl', function ($scope, $cookies, $window, commService, $rootScope, $http, navbar) {
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
               username: $cookies.getObject("user").userName,
               restaurant: {
                  name: name,
                  address: address
               },
               time: time,
               travelMethod: transport
            };
            $scope.request = $http.put(baseUrl + "goingSomewhere", submissionObject)
               .then(function success(response) {
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
   
      function testRegex(regex, value, tag) {
         
         var errorColor = "red";
         
         //if the time matches the regular expression
         if (regex.test(value)) {
            //leave the text be whatever color it is normally
            $(tag).css("color", "");
            return true;
         }
         else {
            $(tag).css("color", errorColor);
            return false;
         }
      }
   
      $("#timeInput").on("focusout", function () {
         var userValue = $("#timeInput").val();
         
         //match either one or two numbers, then a :, then two numbers
         var timeRule = new RegExp("^[0-9]{1,2}:[0-9]{2}$");
         
         if (testRegex(timeRule, userValue, "#timeInput") || userValue === "") {
            $("#error").html("");
         }
         else {
            $("#error").html("the departure time does not match the required format");
         }
         
      });
   
      
      
      
   });

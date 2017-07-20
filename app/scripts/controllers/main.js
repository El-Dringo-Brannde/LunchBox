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
   .controller('MainCtrl', function ($scope, $cookies, $http, $window,
      $rootScope, commService, lunchservice, navbar, toastr, groupService) {
      var baseUrl = "http://localhost:3005/";

      $scope.restaurant = {};
      $scope.restaurant.name = "";
      $scope.restaurant.address = "";
      $scope.time = "";
      $scope.tranport = "";

      navbar()
      var userName;
      commService.get().name == undefined ? userName = $cookies.getObject("user").userName : userName = commService.get().userName
      $scope.user = userName.split(",").pop()
      $scope.activeUsers = []
      $scope.getActiveUsersHTTP = function () {

         $http.get('http://localhost:3005/getActiveUsers').then(function success(response) {
            for (var i = 0; i < response.data.length; i++) {
               if (response.data[i].where !== "") {
                  $scope.activeUsers.push(response.data[i])
                  $scope.activeUsers[i].peopleGoing = $scope.activeUsers[i].peopleGoing
                  $scope.activeUsers[i].peopleGoingCount = $scope.activeUsers[i].peopleGoing.length
               }
            }
         });
      }
      $scope.getActiveUsersHTTP()

      $scope.httpResults = []
      $rootScope.$on("mapLocationClick", function (event, restaurant) {
         $scope.$apply(function () {
            $scope.restaurant.name = restaurant.name;
            $scope.restaurant.address = restaurant.address;
         });
      });

      $scope.makeHttpCall = function (restaurantName) {
         $http({
            method: 'GET',
            headers: {
               'user-key': zomatoKey,
            },
            url: "https://developers.zomato.com/api/v2.1/search?q='" + restaurantName + "'entity_type=city&lat=45.5008823&lon=-122.6777504&radius=10000&sort=rating",
         }).then(function success(response) {
            for (var i = 0; i < response.data.restaurants.length; i++) {
               if (response.data.restaurants[i].restaurant.name == restaurantName) {
                  $scope.httpResults = response.data.restaurants[i].restaurant
               }
            }
         });
      }

      $scope.canJoin = true;
      $scope.plusOne = function (group) {
         for (var i = 0; i < group.peopleGoing.length; i++) {
            if (group.peopleGoing[i] == $cookies.getObject("user").full) {
               $scope.canJoin = false
               toastr("You already joined this group!", "warning")
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
                  personGoing: $cookies.getObject("user").full
               }
            }).then(function success(response) {
               group.peopleGoingCount += 1
               group.peopleGoing.push($cookies.getObject("user").full)
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
            $scope.makeHttpCall(group.where);
            $scope.group = lunchservice.loadDetails(group, $scope.httpResults)
         }
      }
      $scope.showForm = true;
      $scope.moreInfo = function (group) {
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
            //$scope.submissionError = "Error, all fields are required for creating an event";
            toastr("All fields are required for creating an event", "error")
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
               looking: "true",
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
                     toastr("Event Posted", "success")
                  },
                  function failiure(response) {
                     toastr("Post Failed", "error");
                  });
         }
      };

      function timeToDecimal(t) {
         var arr = t.split(':');
         return parseFloat(parseInt(arr[0], 10) + '.' + parseInt((arr[1] / 6) * 10, 10));
      }

      function timeCleaner(time) {
         if (parseInt(time.split(":")[0]) < 8) {
            time = time.split(":")
            time[0] = (parseInt(time) + 12).toString();
            time = time[0] + ":" + time[1];
         }
         var curTime = new Date().toTimeString().split(" ")[0].split(":")
         curTime.pop()
         curTime = curTime[0] + ":" + curTime[1]
         return (timeToDecimal(curTime) > timeToDecimal(time))
      }

      setInterval(function() {
         var foo = $scope.activeUsers.length;
         $http.get('http://localhost:3005/getActiveUsers')
            .then(function success(response) {
               var expired = false;
               response.data.forEach(function(ele) {
                  if (timeCleaner(ele.time) == true)
                     expired = true
               });
               if (response.data.length == foo && expired == false)
                  null
               else {
                  response.data.sort(function (a, b) {
                     var textA = a.fullName.toUpperCase();
                     var textB = b.fullName.toUpperCase();
                     return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                  });
                  $scope.activeUsers.sort(function (a, b) {
                     var textA = a.fullName.toUpperCase();
                     var textB = b.fullName.toUpperCase();
                     return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                  });
                  var i = 0;
                  $.each(response.data, function(idx, ele) {
                     if ($scope.activeUsers[i] == undefined || response.data[i] == undefined ||
                        timeCleaner(ele.time) == true) {
                        return false //breaks out of loop
                     }
                     if ($scope.activeUsers[i].username != response.data[i].username)
                        return false //breaks out of loop
                     i++;
                  });
                  if (response.data.length > $scope.activeUsers.length) {
                     $scope.activeUsers.push(response.data[i]);
                     $scope.activeUsers.sort(function (a, b) {
                        var textA = a.fullName.toUpperCase();
                        var textB = b.fullName.toUpperCase();
                        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                     });
                  } else if ((response.data.length < $scope.activeUsers.length || expired === true) &&
                     i != $scope.activeUsers.length) {
                     console.log($scope.activeUsers[i])
                     $http.put("http://localhost:3005/userReturned", {
                        name: $scope.activeUsers[i].username
                     })
                     _.remove($scope.activeUsers, $scope.activeUsers[i])

                  }
               }
            });
      }, 5000);

      function testRegex(regex, value, tag) {

         var errorColor = "red";

         //if the time matches the regular expression
         if (regex.test(value)) {
            //leave the text be whatever color it is normally
            $(tag).css("color", "");
            return true;
         } else {
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
         } else {
            $("#error").html("the departure time does not match the required format");
         }

      });
   });

//global variables go here to suppress warnings
/*global $, _*/

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
      $scope.showWebsite = false;

      //create empty scope elements for what the users will enter in the form fields
      $scope.restaurant = {};
      $scope.restaurant.name = "";
      $scope.restaurant.address = "";
      $scope.time = "";
      $scope.tranport = "";

      //load the navbar
      navbar();

      var userName;

      //if the commService doesn't have the username, then get it from the cookie
      if (commService.get().name == undefined) {
         userName = $cookies.getObject("user").userName;
      } else {
         userName = commService.get().userName;
      }

      $scope.user = userName.split(",").pop();
      $scope.activeUsers = [];
      $scope.getActiveUsersHTTP = function () {
         $http.get(baseUrl + 'getActiveUsers').then(function success(response) {
            for (var i = 0; i < response.data.length; i++) {
               if (response.data[i].where !== "") {
                  $scope.activeUsers.push(response.data[i]);
                  $scope.activeUsers[i].peopleGoing = $scope.activeUsers[i].peopleGoing;

                  //if the number of people who are going don't exist or its been initialized to 0, then set it to 1
                  if ($scope.activeUsers[i].peopleGoing.length === undefined || $scope.activeUsers[i].peopleGoing.length === 0) {
                     $scope.activeUsers[i].peopleGoingCount = 1;
                  } else {
                     //set it to the value found in the database
                     $scope.activeUsers[i].peopleGoingCount = $scope.activeUsers[i].peopleGoing.length;
                  }
               }
            }
         });
      };
      $scope.getActiveUsersHTTP();

      $scope.httpResults = [];

      //when someone clicks on a pin on the map
      $rootScope.$on("mapLocationClick", function (event, restaurant) {
         //make sure the scope updates with these new contents
         $scope.$apply(function () {
            //set the restaurant name and address to the contents passed to us from mapController.js
            $scope.showWebsite = true;
            $scope.restaurant.name = restaurant.name;
            $scope.restaurant.address = restaurant.address;
            $scope.restaurant.website = restaurant.website;
            $scope.restaurant.phone = restaurant.phone;
            $scope.restaurant.rating = restaurant.rating;

            //make sure the associated labels on the input are moved out of the way when text is thrown in
            $("label[for='restaurantNameInput']").addClass("is-active is-completed");
            $("label[for='restaurantAddressInput']").addClass("is-active is-completed");
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
                  $scope.httpResults = response.data.restaurants[i].restaurant;
               }
            }
         });
      };

      $scope.canJoin = true;
      $scope.plusOne = function (group) {
         for (var i = 0; i < group.peopleGoing.length; i++) {
            if (group.peopleGoing[i] == $cookies.getObject("user").full) {
               $scope.canJoin = false;
               toastr("You are already part of that group", "warning");
               $scope.isActive = function () {
                  return true;
               };
            }
         }
         if ($scope.canJoin == true) {
            $http({
               method: "PUT",
               url: baseUrl + 'personGoing',
               data: {
                  name: group.username,
                  personGoing: $cookies.getObject("user").full
               }
            }).then(function success(response) {
               group.peopleGoingCount += 1;
               group.peopleGoing.push($cookies.getObject("user").full);
            });
            $scope.isActive = function () {
               return true;
            };
         }
         $scope.showInfo = false;
         $rootScope.$on("dataPopulated", function () {
            $scope.showInfo = true;
         });
         $scope.loadGroup = function (group) {
            $scope.makeHttpCall(group.where);
            $scope.group = lunchservice.loadDetails(group, $scope.httpResults);
         };
      };
      $scope.showForm = true;
      $scope.moreInfo = function (group) {
         $scope.showForm = false;
         $scope.groupDetails = groupService.groupDetails(group);
      };

      $scope.createEvent = function () {
         //assign to temp variables for easy readibility
         var name = $scope.restaurant.name,
            address = $scope.restaurant.address,
            time = $scope.time,
            transport = $scope.transport;

         //if any of them are empty show an error
         if (name === "" || address === "" || time === "" || transport === "") {
            toastr("All fields are required for creating an event", "error");
         } else {
            $scope.canPost = false;
            var timeRule = new RegExp("^[0-9]{1,2}:[0-9]{2}$");
            if (!timeRule.test(time)) {
                  $scope.canPost = false;
               $("#error").html("the departure time is not in the proper format (eg. 12:00)");
            }
            else if(timeRule.test(time)){
                  $scope.canPost = true;
            }
            //an obejct to gather all the form data
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
            //post to the LunchBox-Services a the data we just gathered
            if($scope.canPost == true){
            $scope.request = $http.put(baseUrl + "goingSomewhere", submissionObject)
               .then(function success(response) {
                     //clear all the input fields after the data has been put in the database
                     $scope.restaurant.name = "";
                     $scope.restaurant.address = "";
                     $scope.time = "";
                     $scope.tranport = "";
                     toastr("Form submitted!", "success");
                     $("label").removeClass("is-active is-completed");
                  },
                  function failiure(response) {
                     console.log("there was an error posting the data");
                     $scope.submissionError = "there was an error posting the data";
                  });
            }
         }
      };

      function timeToDecimal(t) {
         var arr = t.split(':');
         return parseFloat(parseInt(arr[0], 10) + '.' + parseInt((arr[1] / 6) * 10, 10));
      }

      function timeCleaner(time) {
         if (parseInt(time.split(":")[0]) < 8) {
            time = time.split(":");
            time[0] = (parseInt(time) + 12).toString();
            time = time[0] + ":" + time[1];
         }
         var curTime = new Date().toTimeString().split(" ")[0].split(":");
         curTime.pop();
         curTime = curTime[0] + ":" + curTime[1];
         return (timeToDecimal(curTime) > timeToDecimal(time));
      }

      setInterval(function () {
         var foo = $scope.activeUsers.length;
         $http.get('http://localhost:3005/getActiveUsers')
            .then(function success(response) {
               var expired = false;
               response.data.forEach(function (ele) {
                  if (timeCleaner(ele.time) == true) {
                     expired = true;
                  }
               });
               if (response.data.length == foo && expired == false) {
                  null; //afriad to change it
               } else {
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
                  $.each(response.data, function (idx, ele) {
                     if ($scope.activeUsers[i] == undefined || response.data[i] == undefined ||
                        timeCleaner(ele.time) == true) {
                        return false; //breaks out of loop
                     }
                     if ($scope.activeUsers[i].username != response.data[i].username) {
                        return false; //breaks out of loop
                     }
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
                     console.log($scope.activeUsers[i]);
                     $http.put("http://localhost:3005/userReturned", {
                        name: $scope.activeUsers[i].username
                     });
                     toastr($scope.activeUsers[i].fullName + " has left for lunch", "success");
                     _.remove($scope.activeUsers, $scope.activeUsers[i]);

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
            $("#error").html("the departure time is not in the proper format (eg. 12:00)");
         }

      });

      $(".textBox").focus(function () {
         /*
         - Grab the id of the text box, identify the label for that associated id, and add in the attribute
         is-active and is-completed. 
         - is-active moves the label up and makes it blue.
         - is-completed keeps the label there and makes it grey. 
         */
         $("label[for='" + $(this).attr("id") + "']").addClass("is-active is-completed");
      });

      $(".textBox").focusout(function () {
         //if the value of the box is empty
         if ($(this).val() === "") {
            //grab the id of the selected box, target the associated label and remove the is-completed class
            $("label[for='" + $(this).attr("id") + "']").removeClass("is-completed");
         }
         //remove the is active class
         $("label[for='" + $(this).attr("id") + "']").removeClass("is-active");
      });

   });

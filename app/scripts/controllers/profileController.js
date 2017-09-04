/*global $, google*/

'use strict';

/**
 * @ngdoc function
 * @name lunchBoxApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the lunchBoxApp
 */
angular.module('lunchBoxApp')
   .controller('ProfileCtrl', function($scope, $cookies, $http,
      commService, $rootScope, navbar, httpService, socketIOService,
      mapService, toastr, timeService, $location) {

      var searchBox;
      var map;

      ////////////////////
      // Init Functions //
      ////////////////////

      function timeStyle() {
         if ($scope.user) {
            if ($scope.user.futureEvents) {
               for (var i = 0; i < $scope.user.futureEvents.length; i++) {
                  if ($scope.user.futureEvents[i].restaurant) {
                     $scope.user.futureEvents[i].restaurant.date =
                        new Date($scope.user.futureEvents[i].restaurant.time).toLocaleDateString();
                     $scope.user.futureEvents[i].restaurant.time =
                        timeService.UTCtoString($scope.user.futureEvents[i].restaurant.time)
                  }
               }
            } else {
               console.log("future events not found");
            }
            if ($scope.user.privateEvents) {
               for (var i = 0; i < $scope.user.privateEvents.length; i++) {
                  if ($scope.user.privateEvents[i].restaurant) {
                     $scope.user.privateEvents[i].restaurant.date =
                        new Date($scope.user.privateEvents[i].restaurant.time).toLocaleDateString();
                     $scope.user.privateEvents[i].restaurant.time =
                        timeService.UTCtoString($scope.user.privateEvents[i].restaurant.time);
                  }
               }
            } else {
               console.log("private events not found");
            }
            if ($scope.user.notifications) {
               for (var i in $scope.user.notifications) {
                  if ($scope.user.notifications[i].restaurant) {
                     if (!$scope.user.notifications[i].host.full)
                        $scope.user.notifications[i].host.full =
                        $scope.user.notifications[i].host.fullName;
                     $scope.user.notifications[i].restaurant.time =
                        timeService.UTCtoString($scope.user.notifications[i].restaurant.time)
                  } // prevent accessing food requests which crash
               }
               console.log($scope.user.notifications)
            } else {
               console.log("notifications not found");
            }
         } else {
            console.log("user not found");
         }
      }

      //start up the navbar
      navbar();

      //set the current user info
      httpService.getUser("user?username=" + $cookies.getObject("user").username)
         .then(function(response) {
            //get the user info
            $scope.user = response.data[0];

            if (!$scope.user.profilePic) {
               $scope.user.profilePic = "https://image.freepik.com/free-icon/user-male-silhouette_318-55563.jpg";
            }

            $scope.showEvent = true;
            if (!$scope.user.restaurant.name) {
               $scope.showEvent = false;
            }
            $scope.user.restaurant.time = timeService.UTCtoString($scope.user.restaurant.time);

            //show the time for future events
            timeStyle();

            //broadcast the office location
            socketIOService.init($scope.user.officeLoc);
         });

      $scope.showMap = false;
      $scope.foundPhoto = false;
      $scope.showNotifications = false;
      $scope.showRestaurantsAndFriends = false;
      $scope.showProfile = true;
      $scope.currEvents = false;
      $scope.defaultLocation = $cookies.getObject("user").officeLoc;
      $scope.AmPm = "PM";
      $scope.transport = "walking";


      //////////////////////////
      // Navigation Functions //
      //////////////////////////

      $scope.profilePage = function() {
         $scope.showNotifications = false;
         $scope.showRestaurantsAndFriends = false;
         $scope.showProfile = true;
         $scope.currEvents = false;
      };
      $scope.currEventsPage = function() {
         $scope.showNotifications = false;
         $scope.showRestaurantsAndFriends = false;
         $scope.showProfile = false;
         $scope.currEvents = true;
      }
      $scope.notificationsPage = function() {
         $scope.showNotifications = true;
         $scope.showRestaurantsAndFriends = false;
         $scope.showProfile = false;
         $scope.currEvents = false;
      };
      $scope.restaurantsPage = function() {
         $scope.showNotifications = false;
         $scope.showRestaurantsAndFriends = true;
         $scope.showProfile = false;
         $scope.currEvents = false;
      };


      ///////////////////////
      // Map Functionality //
      ///////////////////////
      function initMap(location) {
         map = new google.maps.Map(document.getElementById('profileMap'), {
            center: location,
            scrollwheel: true,
            zoom: 17
         });
         var input = document.getElementById('searchTextField');
         // map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);
         searchBox = new google.maps.places.SearchBox(input);
         var bounds = new google.maps.LatLngBounds();
         var cityCircle = new google.maps.Circle({
            strokeOpacity: 0.0,
            fillOpacity: 0.0,
            map: map,
            center: location,
            radius: 3000
         }); // create radius around current center to refine results
         searchBox.setBounds(bounds.union(cityCircle.getBounds()));
      }

      //starting location
      var initLoc = mapService.getOffice($cookies.getObject("user").officeLoc);
      //if the initial location does not exists, set it to portland
      if (!initLoc) {
         initLoc = mapService.officeLocation.Portland;
      }
      //start up the map
      initMap(initLoc);
      var markers = [];

      $scope.officeNames = mapService.getOfficeNames();

      searchBox.addListener('places_changed', function() {
         var places = searchBox.getPlaces();
         if (places.length == 0) {
            return;
         }

         var placeObj = {
            phone: places[0].international_phone_number,
            address: places[0].formatted_address,
            name: places[0].name,
            website: places[0].website
         };
         httpService.getYelp(placeObj.phone).then(function(r) {
            placeObj.yelp = r.data.url;
            addFavorite(placeObj);
         });

         // Clear out the old markers.
         markers.forEach(function(marker) {
            marker.setMap(null);
         });
         markers = [];

         // For each place, get the icon, name and location.
         var bounds = new google.maps.LatLngBounds();
         places.forEach(function(place) {
            if (!place.geometry) {
               console.log("Returned place contains no geometry");
               return;
            }
            var icon = {
               url: place.icon,
               size: new google.maps.Size(71, 71),
               origin: new google.maps.Point(0, 0),
               anchor: new google.maps.Point(17, 34),
               scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
               map: map,
               icon: icon,
               title: place.name,
               position: place.geometry.location
            }));

            if (place.geometry.viewport) {
               // Only geocodes have viewport.
               bounds.union(place.geometry.viewport);
            } else {
               bounds.extend(place.geometry.location);
            }
         });
      });

      function readyPendingResponse(obj, state) {
         obj.push = obj.host;
         obj.status = state;
         return obj;
      }

      $scope.acceptEvent = function(notification) {
         notification = readyPendingResponse(notification, "accepted");
         httpService.putObj("pending", notification)
      };

      $scope.declineEvent = function(notification) {
         notification = readyPendingResponse(notification, "declined");
         httpService.putObj("pending", notification);
      };

      $scope.showShortFields = false;
      $scope.exitPopup = function() {
         $("#formContainer").removeClass("show");
      };

      $scope.quickStartEvent = function(fave) {
         $("#formContainer").addClass("show");
         $scope.loc = fave;
         $scope.showShortFields = true;
      };

      $scope.postEvent = function() {
         $scope.sendPost = true;
         //if the time is valid
         if (timeService.validTime($scope.time)) {
            timeService.setTime($scope.time, $scope.AmPm);
            if ($scope.AmPm == "PM" && timeService.time.hour < 12) {
               timeService.time.hour += 12;
            }
         } else if ($scope.time !== undefined) {
            toastr("The time is not in a correct format", "warning");
            $scope.sendPost = false;
         }

         //if the fields are empty
         if ($scope.time === undefined) {
            toastr("Fields must not be empty", "warning");
            $scope.sendPost = false;
         }

         //if we never hit an error
         if ($scope.sendPost === true) {
            $("#formContainer").removeClass("show");

            timeService.formatISOdate();
            var timeVariable = timeService.ISOstring;

            var submissionObject = {
               username: $cookies.getObject("user").username,
               restaurant: {
                  name: $scope.loc.name,
                  address: $scope.loc.address,
                  phone: $scope.loc.phone,
                  yelp: $scope.loc.yelp,
                  website: $scope.loc.website,
                  peopleGoing: [],
                  time: timeVariable,
                  travelMethod: $scope.transport,
                  carSeating: $scope.carSeating,
               },
               looking: "true"
            };
            httpService.putObj('user', submissionObject);
            toastr("Event created", "success");
         }
      };


      $scope.inviteFriend = function(friend) {
         httpService.getUser("user?username=" + $cookies.getObject("user").username)
            .then(function(resp) {
               var cur = resp.data[0];
               cur.restaurant.invitees = [friend]; // array needed for looping on server side
               httpService.profilePut('invites', {
                  restaurant: cur.restaurant,
                  host: $cookies.getObject('user')
               }).then(function() {
                  toastr("Invite sent to " + friend.fullName + "!", "success");
                  friend.noInvite = true;
               });
            });
      };


      function addNotificationUpdate() {
         $rootScope.$on($scope.user.officeLoc + "_notifications", function(event, userNotified) {
            $scope.$apply(function() {
               var curNot = $scope.user.notifications;
               if (userNotified.username == $scope.user.username && curNot.length != userNotified.notifications.length) {
                  curNot.push(userNotified.notifications.pop());
                  if (curNot[curNot.length - 1].who.requesterusername != $cookies.getObject('user').username) {
                     if (curNot[curNot.length - 1].type == "status change") {
                        toastr(curNot[curNot.length - 1].message, "success");
                     } else {
                        toastr(curNot[curNot.length - 1].who.requesterName + " has invited you to lunch!", "success");
                     }
                  }
               }
            });
         });
      } // When a new notification is added, update the page.

      function getCurFriends() {
         httpService.getUser("user?username=" + $cookies.getObject("user").username)
            .then(function(resp) {

               $scope.friends = resp.data[0].friends;
               addNotificationUpdate();
               if ($scope.user.profilePic == "") {
                  $scope.userImage = "https://image.freepik.com/free-icon/user-male-silhouette_318-55563.jpg";
               } else {
                  $scope.userImage = $scope.user.profilePic;
                  $scope.foundPhoto = true;
               }
            });
      }

      //get users favorite foods
      function getFoodFaves() {
         httpService.getUser("user?username=" + $cookies.getObject("user").username)
            .then(function(response) {
               $scope.favorites = response.data[0].favorites;
            });
      }

      //add users to object for autocomplete search
      var bigUserObj = {};
      httpService.getUser('user')
         .then(function(resp) {
            var lunchBoxUsers = [];
            resp.data.forEach(function(ele) {
               bigUserObj[ele.fullName] = ele.username;
               lunchBoxUsers.push(ele.fullName);
            });

            $("#friendSearch").autocomplete({
               source: lunchBoxUsers,
               select: function(e, ui) {
                  $scope.friendSearch = ui.item.value;
                  addFriend();
               }
            });
         });

      //add friends, not mutual
      function addFriend() {
         httpService.getUser("user?username=" + bigUserObj[$scope.friendSearch])
            .then(function(resp) {
               httpService.putObj('push', {
                  username: $cookies.getObject("user").username,
                  push: {
                     friends: {
                        fullName: resp.data[0].fullName,
                        username: resp.data[0].username,
                        email: resp.data[0].email
                     }
                  }
               }).then(function() {
                  getCurFriends();
                  $scope.friendSearch = "";
               });
            });
      };

      function addFavorite(favFood) {
         httpService.putObj('push', {
            username: $cookies.getObject('user').username,
            push: {
               favorites: favFood
            }
         }).then(function() {
            getFoodFaves();
            $scope.foodfav = "";
            $("#searchTextField").val('');
         });
      };


      //updates the cookie and the database with the new office location
      $scope.changeDefaultLocation = function() {
         //update the database with the new location
         httpService.putObj("user", {
            username: $cookies.getObject('user').username,
            officeLoc: $scope.defaultLocation
         });

         //get the user object from the cookie
         var user = $cookies.getObject("user");
         //modify the office location
         user.officeLoc = $scope.defaultLocation;
         //update the cookie with the new location
         $cookies.putObject("user", user);
         toastr("Your default location has been changed to " + $scope.defaultLocation, "success");
      };

      getFoodFaves();
      getCurFriends();
   });
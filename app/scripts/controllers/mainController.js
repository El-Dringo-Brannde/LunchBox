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
angular.module('lunchBoxApp').controller('MainCtrl', function($scope, $cookies,
   $rootScope, lunchservice, navbar, toastr, groupService, $timeout,
   mapService, socketIOService, regexService, timeService, $location, httpService,
   joinGroupService, postEventService, requestFoodService, $http) {

   //if user dne return to login page
   if (!$cookies.getObject("user")) {
      alert("Please login before using LunchBox");
      $location.path("/login");
   }
   navbar();

   socketIOService.init($cookies.getObject('user').officeLoc);
   timeService.loadCal();
   $scope.day = new Date().toLocaleDateString();
   $scope.today = new Date().toLocaleDateString();
   $("#eventCal").datepicker({
      dateFormat: 'yy-mm-dd',
      showAnim: "fadeIn",
      minDate: 0,
      onSelect: function(dateText) {
         $scope.day = new Date($("#eventCal")[0].value);
         $scope.day.setUTCHours(9);
         $scope.day.toUTCString();
         var todaysDate = new Date().toLocaleDateString();
         if (todaysDate[0] != 1)
            todaysDate = "0" + todaysDate
         if (timeService.cleanDate(dateText) == todaysDate)
            $scope.getActiveUsersHTTP($cookies.getObject("user").officeLoc);
         else
            getFutureEvents();
      }
   }).val(timeService.getTodaysDate(0));

   //Init scope values
   $scope.showWebsite = false;
   $scope.restaurant = {
      name: "",
      address: ""
   };
   $scope.event = {
      transport: "walking",
      time: "",
      AmPm: "PM",
      pubPriv: "public",
      inviteList: [],
      isHost: false,
      sizeLimit: null
   };
   $scope.activeUsers = [];
   $scope.showPriv = false;
   $scope.isEdit = false;
   $scope.sendReq = false;
   $scope.bigLocationObject = mapService.officeLocation;
   $scope.userLoc = $cookies.getObject("user").officeLoc;
   $scope.httpResults = [];
   $scope.showForm = true;
   $scope.canJoin = true;
   var bigObj = {};
   $scope.bigLocationObject = mapService;

   $scope.userLoc = $cookies.getObject("user").officeLoc;


   $(window).resize(function() {
      if (window.innerHeight < 250)
         $("#formContainer").hide();
      else
         $("#formContainer").show();
   }); // to prevent the dialog box from showing at stupid small levels

   if (mapService.officeLocation[$cookies.getObject("user").officeLoc]) {
      $scope.office = mapService.officeLocation[$cookies.getObject("user").officeLoc];
   } else {
      $scope.office = mapService.Other;
   }


   var username = $cookies.getObject("user").username;

   $scope.user = username.split(",").pop();

   //////////////////////
   // Helper Functions //
   //////////////////////
   function UTCtoString(utcString) {
      return timeService.UTCtoString(utcString);
   }

   function initAutoCompleteInvites() {
      httpService.getUser('user').then(function(resp) {
         var lunchBoxUsers = [];
         resp.data.forEach(function(ele) {
            lunchBoxUsers.push(ele.fullName);
            bigObj[ele.username] = {
               fullName: ele.fullName.toLowerCase(),
               username: ele.username,
               email: ele.email
            };
         });
         $("#friendSearch").autocomplete({
            source: lunchBoxUsers
         });
      });
   }
   initAutoCompleteInvites();

   //drop a pin on the map in that location
   function dropPin(lunchEvent) {
      $rootScope.$broadcast("dropPin", lunchEvent);
   }
   //if the picture does not exist, send back a default photo
   function addDefaultPhoto(picture) {
      if (picture) {
         return picture;
      }
      return "https://image.freepik.com/free-icon/user-male-silhouette_318-55563.jpg";
   }

   function moveMapCenter(address) {
      $rootScope.$broadcast("moveMapCenter", {
         address: address
      });
   }

   function clearInput() {
      $scope.restaurant.name = "";
      $scope.restaurant.address = "";
      $scope.event.sizeLimit = "";
      $scope.event.time = "";
      $scope.event.inviteList = [];
      $scope.date = "";
      $scope.tranport = "";
      timeService.loadCal();
   }

   function futureANDPrivateEvent(postEventHelper) {
      if (postEventService.futureEvent) {
         httpService.putObj('specialEvent', {
            username: $cookies.getObject('user').username,
            push: {
               futureEvents: postEventHelper,
               privateEvents: postEventHelper
            }
         }).then(function(r) {
            toastr('Private future event has been posted', 'success');
            clearInput();
         });
      }
   };

   /////////////////
   // Event Cards //
   /////////////////


   function findFutureEvent(event) {
      var eventObject = {};
      //for all the events listed as futureEvents
      event.futureEvents.forEach(function(date) {
         //get the date of the future event
         var eventTime = new Date(date.restaurant.time).toLocaleDateString();

         //get today's date
         var today = $scope.day.toLocaleDateString();

         if (eventTime === today) {
            //convert the time and photo
            date.restaurant.time = UTCtoString(date.restaurant.time);
            date.restaurant.date = eventTime;
            event.profilePic = addDefaultPhoto(event.profilePic);

            eventObject = {
               host: date.host,
               profilePic: event.profilePic,
               restaurant: date.restaurant,
               objID: date.objID,
               username: date.username
            };
         }
      });
      return eventObject;
   }

   function getFutureEvents() {
      //get data filtered by location
      httpService.getUser('futureEvents?officeLoc=' + $cookies.getObject("user").officeLoc).then(function(res) {
         $scope.activeUsers = [];
         //create an event object that will be filled the data
         var eventObject = {};
         //for each event returned
         res.data.forEach(function(eventDetails) {
            eventObject = findFutureEvent(eventDetails);
            //if the event object is not empty, push the event
            if (!_.isEmpty(eventObject)) {
               $scope.activeUsers.push(eventObject);
            }
         });
      });
   }

   function addDateObject(obj) {
      obj.restaurant.date =
         new Date(obj.restaurant.time).toLocaleDateString();
      return obj;
   }
   $scope.getActiveUsersHTTP = function(location) {
      $scope.activeUsers = [];
      if (!location)
         location = $cookies.getObject('user').officeLoc
      var query;
      $scope.showPriv = !$scope.showPriv
      //if our location is empty, then load all of them
      //otherwise load the ones and filter by office location
      if (location === "") {
         query = "user?looking=true";
      } else {
         query = 'user?looking=true&officeLoc=' + location;
      }

      httpService.getUser(query).then(function success(response) {
         //if our date filter is today
         response.data.forEach(function(lunchEvent) {
            //if the location exists
            if (!lunchEvent.where) {
               dropPin(lunchEvent);
               //set the time and photo
               lunchEvent = addDateObject(lunchEvent);
               lunchEvent.restaurant.time = UTCtoString(lunchEvent.restaurant.time);
               lunchEvent.profilePic = addDefaultPhoto(lunchEvent.profilePic);

               //put the event in the array
               $scope.activeUsers.push(lunchEvent);
            }
         });
      });
   };
   //the function has been defined, now we call it
   $scope.getActiveUsersHTTP($cookies.getObject("user").officeLoc);


   $scope.addToList = function() {
      var key = _.findKey(bigObj, {
         fullName: $scope.invited
      });
      $scope.event.inviteList.push(bigObj[key]);
      $scope.invited = "";
   };

   $scope.removeInv = function(usr) {
      var idx = $scope.event.inviteList.indexOf(usr);
      if (idx > -1) {
         $scope.event.inviteList.splice(idx, 1);
      }
   };

   $scope.addToFave = function() {
      $scope.restaurant.username = $cookies.getObject('user').username;
      httpService.putObj('push', {
            username: $cookies.getObject('user').username,
            push: {
               favorites: $scope.restaurant
            }
         })
         .then(function() {
            toastr("Location added to favorites!", "success");
         });
   };

   //////////////////////////////////
   // Root Scope Catcher Functions //
   //////////////////////////////////

   //Autofill restaurant fields based on google maps pin
   $rootScope.$on("mapLocationClick", function(event, restaurant) {
      $scope.$apply(function() {
         $scope.showWebsite = true;
         $scope.foundByMap = true;
         $scope.restaurant.name = restaurant.name;
         $scope.restaurant.address = restaurant.address;
         $scope.restaurant.website = restaurant.website;
         $scope.restaurant.phone = restaurant.phone;
         $scope.restaurant.rating = restaurant.rating;
         httpService.getYelp(restaurant.phone)
            .then(function(resp) {
               $timeout(function() { // to wait til the Angular digest cycle is done
                  $scope.$apply(function() {
                     $scope.restaurant.yelp = resp.data.url;
                     $scope.restaurant.image = resp.data.image_url;
                  });
               }, 0, false);
            });
      });
   });

   $rootScope.$on("dataPopulated", function() {
      $scope.showInfo = true;
   });

   $rootScope.$on("userUpdate", function(event, data) {
      $scope.$apply(function() {
         data.restaurant.time = UTCtoString(data.restaurant.time);
         $scope.activeUsers.push(data);
      });
   });

   $rootScope.$on("userLeft", function(event, data) {
      $scope.removedEvent = false;
      if (!Array.isArray(data)) {
         data = [data];
         $scope.removedEvent = true;
      }
      $.each($scope.activeUsers, function(idx, ele) {
         for (var i = 0; i < data.length; i++) {
            if (ele.username == data[i].username) {
               $scope.$apply(function() {
                  if ($scope.removedEvent == true && $scope.isEdit == false) {
                     toastr("Event removed", "warning");
                     $scope.showForm = true;
                  } else if ($scope.isEdit == false) {
                     toastr(data[i].fullName + " has left for lunch!", "success");
                  }
                  _.remove($scope.activeUsers, $scope.activeUsers[idx]);
                  _.remove(data, data[i]);
                  i--;
               });
            }
         }
      });
   });


   $scope.addUserToInviteList = function() {
      var key = _.findKey(bigObj, {
         fullName: $scope.invited.toLowerCase()
      });
      if (!key)
         inputSanitizer.users.showError($scope.invited);
      else
         $scope.event.inviteList.push(bigObj[key]);
      $scope.invited = "";
   };

   $scope.plusOne = function() {
      var group = $scope.group;
      if (joinGroupService.joinGroup($scope.group)) {
         if ($scope.today != new Date($scope.day).toLocaleDateString()) {
            httpService.putObj('object', {
               objID: $scope.group.objID,
               array: 'futureEvents',
               field: 'restaurant.peopleGoing',
               overWrite: $cookies.getObject('user').full,
               pushOrSet: 'push'
            }).then(function() {
               group.peopleGoing.push($cookies.getObject("user").full);
               $scope.groupDetails = groupService.groupDetails(group);
               toastr("Joined group", "success");
            });
            $scope.isActive = true;
            $scope.canLeave = true;
         } else { // today
            httpService.putObj('push', {
               username: $scope.group.username,
               push: {
                  'restaurant.peopleGoing': $cookies.getObject('user')
               }
            }).then(function() {
               $scope.group.restaurant.peopleGoing.push($cookies.getObject("user"));
               $scope.groupDetails = groupService.groupDetails($scope.group);
               toastr("Joined group", "success");
            });
            $scope.isActive = true;
         }
      }
      $scope.showInfo = false;
   };

   $scope.loadGroup = function(group) {
      $scope.group = lunchservice.loadDetails(group, $scope.httpResults);
   };

   $scope.backToForm = function() {
      $scope.showForm = true;
   };

   //this seems weird, but there are multiple people with the same username
   //so we also use the email to verify
   function isHost(username, email) {
      if (username == $cookies.getObject("user").username ||
         email == $cookies.getObject("user").mail) {
         return true;
      } else {
         return false;
      }
   }
   $scope.moreInfo = function(group) {
      //hide the form field
      $scope.showForm = false;
      //check if the user is the host
      $scope.event.isHost = isHost(group.username, group.email);
      if (group.host.username == $cookies.getObject("user").username) {
         $scope.event.isHost = true;
      }


      //this puts the group date into $scope.group so the join group functionality can access it
      $scope.group = group;


      $scope.groupDetails = groupService.groupDetails(group);
      //if it is a future or private event
      $scope.groupDetails.arrayType = group.arrayType;
      $scope.groupDetails.objID = group.objID;
      if (checkIfAbleToLeave(group))
         $scope.canLeave = true;
      else
         $scope.canLeave = false;


      if (group.futureEvents) {
         moveMapCenter(group.restaurant.address);
      }
   };

   function checkIfAbleToLeave(group) {
      for (var i = 0; i < group.restaurant.peopleGoing.length; i++) {
         if (group.restaurant.peopleGoing[i].full == $cookies.getObject('user').full) {
            return true;
         }
      }
      return false;
   }

   $scope.leaveGroup = function() {
      //if the date is not today
      if ($scope.today !== new Date($scope.day).toLocaleDateString()) {
         for (var x = 0; x < $scope.group.restaurant.peopleGoing.length; x++) {
            if ($cookies.getObject('user').full == $scope.group.restaurant.peopleGoing[x].full) {
               $scope.group.restaurant.peopleGoing.splice(x, 1);
               httpService.putObj('object', {
                  objID: $scope.group.objID,
                  array: 'futureEvents',
                  field: 'restaurant.peopleGoing',
                  overWrite: $scope.group.restaurant.peopleGoing,
                  pushOrSet: 'set'
               }).then(function() {
                  toastr('You have left ' + $scope.group.fullName + 's group', 'warning');
                  $scope.canLeave = false;
               });
               $scope.canLeave = false;
            }
         }
      } else {
         for (var x = 0; x < $scope.group.restaurant.peopleGoing.length; x++) {
            if ($cookies.getObject('user').full == $scope.group.restaurant.peopleGoing[x].full) {
               $scope.group.restaurant.peopleGoing.splice(x, 1);
               httpService.putObj('user', {
                  username: $scope.group.username,
                  'restaurant.peopleGoing': $scope.group.restaurant.peopleGoing
               }).then(function() {
                  toastr('You have left ' + $scope.group.fullName + 's group', 'warning');
                  $scope.canLeave = false;
               });
               $scope.canLeave = false;
            }
         }
         $scope.showInfo = false;
      }
   };

   $scope.bigLocationObject = mapService.officeLocation;
   $scope.mapFilter = function() {
      $rootScope.$broadcast("mapChange", {
         lat: $scope.office.lat,
         lng: $scope.office.lng
      });
      $scope.activeUsers = [];
      $scope.getActiveUsersHTTP(_.findKey(mapService.officeLocation, {
         lat: $scope.office.lat,
         lng: $scope.office.lng
      }));
   };

   function createPublicEvent(helperFun) {
      helperFun.push = $scope.event.inviteList;
      helperFun.restaurant.invitees = $scope.event.inviteList;
      httpService.putObj('invites', helperFun);
      httpService.putObj('user', helperFun).then(function(f) {
         $scope.activeUsers.push(f.data.value);
         clearInput();
         if ($scope.isEdit) {
            toastr("Event edited", "success");
         } else {
            toastr("Form submitted!", "success");
         }
         for (var i = 0; i < $scope.activeUsers.length; i++) {
            if ($scope.activeUsers[i].username == $cookies.getObject("user").username) {
               $scope.hostObj = $scope.activeUsers[i];
            }
         }
         $scope.activeUsers = [];
         $scope.getActiveUsersHTTP($cookies.getObject("user").officeLoc);
         $scope.moreInfo($scope.hostObj);

         if (helperFun && postEventService.futureEvent) {
            helperFun.username = $cookies.getObject('user').username;
            helperFun.arrayType = 'futureEvents';
            httpService.putObj('push', {
               username: $cookies.getObject('user').username,
               push: {
                  futureEvents: helperFun
               }
            }).then(function() {
               toastr('Future event has been posted', 'success');
               clearInput();
            });
         }
      });
   }

   $scope.editEvent = function(group) {
      $scope.inviteList = group.restaurant.invitees;
      $scope.showForm = true;
      $scope.isEdit = true;
      $scope.objID = group.objID;
      $scope.array = group.arrayType;
      $scope.restaurant.name = group.restaurant.name;
      $scope.restaurant.address = group.restaurant.address;
      $scope.time = UTCtoString(group.restaurant.time);
      $scope.restaurant.phone = group.restaurant.phone;
      $scope.restaurant.yelp = group.restaurant.yelp;
      $scope.restaurant.website = group.restaurant.website;
      $scope.restaurant.rating = group.rating;
      $scope.transport = group.restaurant.travelMethod;
      $scope.carSeating = group.restaurant.carSeating;
   };

   $scope.deleteEvent = function(specialEvent) {
      $scope.showForm = true;
      if (!$scope.isEdit)
         toastr("Event Successfully Deleted!", "success");
      var submitObj = {
         username: $cookies.getObject("user").username
      };
      if (specialEvent.objID) {
         submitObj.action = "delete";
         submitObj.which = specialEvent.arrayType;
         submitObj.objID = specialEvent.objID;
      }
      httpService.delete(submitObj).then(function(r) {
         $scope.getActiveUsersHTTP($cookies.getObject("user").officeLoc);
      });
   };

   //create an event when the user presses the submit button on the form
   $scope.createEvent = function() {
      timeService.setDate($("#dateInput")[0].value)
      var eventHelper = postEventService.createEventHelper({
         restaurant: $scope.restaurant,
         event: $scope.event,
         date: $("#dateInput")[0].value,
         isEdit: $scope.isEdit
      });
      if ($scope.event.pubPriv == "public") {
         if (!postEventService.futureEvent)
            createPublicEvent(eventHelper);
         else
            createPublicFutureEvent(eventHelper);
      } else { // private events go here.
         eventHelper.objID = $scope.objID;
         eventHelper.arrayType = "privateEvents";
         $scope.deleteEvent(eventHelper);
         if (postEventService.futureEvent) {
            futureANDPrivateEvent(eventHelper);
            $scope.event.inviteList = [];
            return;
         } else { // just a private Event
            var obj = createPushObject(eventHelper, "privateEvents");
            httpService.putObj('specialEvent', obj);
         }
         if ($scope.isEdit)
            toastr("Event edited!", "success");
         else
            toastr("Private event created!", "success");
         clearInput();
         $scope.event.inviteList = [];
      }
   };

   function createPushObject(obj, type) {
      return {
         push: {
            [type]: obj
         }
      };
   }

   function createPublicFutureEvent(eventHelper) {
      eventHelper.objID = $scope.objID;
      eventHelper.arrayType = "futureEvents";
      var obj = createPushObject(eventHelper, "futureEvents");
      httpService.putObj('specialEvent', obj);
      toastr("Future event created!", "success");
      clearInput();
   }

   function getPrivateUsers() {
      httpService.getUser("privateEvents?username=" + $cookies.getObject('user').username)
         .then(function(f) {
            $scope.activeUsers = [];
            f.data.forEach(function(eventHost) {
               eventHost.privateEvents.restaurant.date =
                  new Date(eventHost.privateEvents.restaurant.time).toLocaleDateString();
               eventHost.privateEvents.restaurant.time =
                  UTCtoString(eventHost.privateEvents.restaurant.time)
               eventHost.privateEvents.restaurant.peopleGoing =
                  eventHost.privateEvents.restaurant.peopleGoing.map(function(e) {
                     return e.fullName;
                  });
               $scope.activeUsers.push(eventHost.privateEvents);
            });
         });
   }

   $scope.showPrivate = function() {
      $scope.activeUsers = [];
      $scope.showPriv = !$scope.showPriv;
      getPrivateUsers();
   };

   $scope.closeFormContainer = function() {
      $("#formContainer").removeClass("show");
   };
   $scope.foodReq = function(group) {
      $("#formContainer").addClass("show");
      $("#formContainer").show();
      $scope.sendReq = !$scope.sendReq;
   };

   $scope.sendRequest = function() {
      var reqHelperObj = {
         food: $scope.pickupFood,
         payment: $scope.pickupPayment,
         groupInfo: $scope.group
      };

      var helpResult = requestFoodService.requestHelper(reqHelperObj);
      if (helpResult) {

         httpService.putObj('request', helpResult);
         toastr("Request Sent", "success");
         $("#formContainer").removeClass("show");
         $scope.pickupFood = "";
         $scope.pickupPayment = "";
      }
   };
});
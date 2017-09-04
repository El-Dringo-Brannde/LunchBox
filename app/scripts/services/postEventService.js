'use strict';

/**
 * @ngdoc service
 * @name lunchBoxApp.postEventService
 * @description
 * # postEventService
 * Service in the lunchBoxApp.
 */
angular.module('lunchBoxApp')
   .service('postEventService', function(toastr, httpService, $cookies, timeService) {
      var self = this;

      //////////////////////
      // Helper Functions //
      //////////////////////

      //if the number is a single digit number, prepend a 0
      function prependZero(number) {
         if (number < 10) {
            return '0' + number;
         }
         return number;
      }

      function emptyFields(obj) {
         //fail if one of the fields is empty
         if (!obj.restaurant.name) {
            toastr("Restaurant name is required for creating an event", "error");
            return true;

         } else if (!obj.restaurant.address) {
            toastr("Restaurant address is required for creating an event", "error");
            return true;

         } else if (!obj.event.time) {
            toastr("Time is required for creating an event", "error");
            return true;


         } else if (!obj.event.transport) {
            toastr("Transport method is required for creating an event", "error");
            return true;
         }

         //if they want to edit it, get the user information
         if (obj.isEdit) {
            httpService.putObj('returned', {
               name: $cookies.getObject("user").username
            });
         }

         return false;
      }

      function setTime(time, AmPm) {
         //fail if the time does not pass the regex
         if (timeService.validTime(time)) {
            //set the time
            timeService.setTime(time, AmPm);
            //format it to be stored in the database
            timeService.formatISOdate();

         } else {
            toastr("The time is not in a valid format", "error");
            return false;
         }
      }

      //////////////////////
      // Method Functions //
      //////////////////////
      /*
       Name: CreateEventHelper
       Input {
         restaurant: {
            name:
            autoName:
            address:
            phone:
            yelpNMenu: url
            website: url
         },
         event: {
            carSeating
            time: time the event will take place
            transport: walking or driving
            AmPm: am or pm
         }
         isEdit:
         date:
      }


      Returns: either an object, or the boolean false
      */
      self.createEventHelper = function(obj) {
         //if any of the input fields were empty
         if (emptyFields(obj)) {
            return false;
         }
         //container function for some timeService calls
         setTime(obj.event.time, obj.event.AmPm);


         var currYear = new Date().getFullYear(),
            //month and day start at 0
            currMonth = prependZero(new Date().getMonth() + 1),
            currDay = prependZero(new Date().getDate()),
            currTime = new Date(),
            date = currYear + "-" + currMonth + "-" + currDay;
         //if the object date is today, then it is not a future event
         self.futureEvent = (date === obj.date) ? false : true;
         //if they want to edit it, get the user information
         if (obj.isEdit) {
            httpService.putObj('returned', {
               name: $cookies.getObject("user").username
            });
         }

         //set our time
         timeService.formatISOdate();
         obj.event.time = timeService.ISOstring;
         //if the object time is less than the current time
         if (timeService.lessThan(obj.date, date)) {
            toastr('You can\'t make meetings for the past!', 'error');
            return false;
         }
         return {
            username: $cookies.getObject("user").username,
            restaurant: {
               name: obj.restaurant.name,
               address: obj.restaurant.address,
               phone: obj.restaurant.phone,
               yelp: obj.restaurant.yelp,
               website: obj.restaurant.website,
               peopleGoing: [],
               invitees: obj.invitees,
               time: new Date(obj.event.time),
               travelMethod: obj.event.transport,
               sizeLimit: obj.event.sizeLimit,
               carSeating: obj.carSeating
            },
            looking: "true",
            host: $cookies.getObject('user')
         };
      };
      return self;
   });
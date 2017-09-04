/*global $*/

'use strict';

/**
 * @ngdoc service
 * @name lunchBoxApp.timeService
 * @description contains an object for formatting and sending time
 * # timeService
 * Service in the lunchBoxApp.
 */
angular.module('lunchBoxApp')
   .service('timeService', function() {
      var self = this;

      self.time = {
         hour: null,
         minute: null
      };
      self.date = {
         day: null,
         month: null,
         year: null
      };
      self.dateObject = new Date();
      self.ISOstring = "";


      //helper functions
      function parseTime(time) {
         var splitTime = time.split(":");
         return {
            hours: parseInt(splitTime[0]),
            minutes: parseInt(splitTime[1])
         };
      }

      self.cleanDate = function(dirtyDate) {
         var day = dirtyDate.split("-").pop();
         dirtyDate = dirtyDate.split("-")
         var tmp = dirtyDate[1] + "/" + day + "/" + dirtyDate[0]
         return tmp;
      }


      /*
       Function: valid time
       Purpose: determined the vailidity of a time and returns a boolean
       Input:
         date: String
      */
      self.validTime = function(time) {
         //remove excess whitespace on either side
         time = time.trim();

         //one-two numbers : two numbers
         var timeRule = new RegExp("^[0-9]{1,2}:[0-9]{2}$");

         //if the time does not pass the regex
         if (!timeRule.test(time)) {
            return false;
         }

         var parsed = parseTime(time);

         if (parsed.hours > 12 || parsed.minutes > 59) {
            return false;
         }

         return true;
      };

      /*
       Function: valid date
       Purpose: determined the vailidity of a date and returns a boolean
       Input:
         date: String
      */
      self.validDate = function(date) {
         //four numbers - one to two numbers - one to two numbers
         var dateRule = new RegExp("[0-9]{4}(\-[0-9]{1,2}){2}");

         //if the date does not pass the regex
         if (!dateRule.test(date)) {
            return false;
         }
         return true;
      };
      //takes two strings as input
      self.validISOdata = function(time, date) {
         if (self.validTime(time) && self.validDate(date)) {
            return true;
         } else {
            return false;
         }
      };
      //this function ideally takes in many different kinds of input
      //currently its super minimal and should be expanded
      self.lessThan = function(one, two) {
         var oneObject = new Date(one),
            twoObject = new Date(two);
         if (oneObject < twoObject) {
            return true;
         }
         return false;
      };
      self.setTime = function(time) {
         if (self.validTime(time)) {
            var parsed = parseTime(time);
            self.time.hour = parsed.hours;
            self.time.minute = parsed.minutes;
         } else {
            console.log("the set time string was not a valid date");
         }
      };
      //time and AmPm are strings
      self.setTime = function(time, AmPm) {
         if (self.validTime(time)) {
            AmPm = AmPm.toLowerCase();
            var parsed = parseTime(time),
               hour = parsed.hours;
            //if it is pm, add 12 hours to make it 24 hour time
            if (AmPm === "pm" && hour < 12) {
               hour += 12;
            }
            self.time.hour = hour;
            self.time.minute = parsed.minutes;
         } else {
            console.log("the set time string was not a valid date");
         }
         if (AmPm !== "pm" && AmPm !== "am") {
            console.log("the AM/PM was neither AM or PM");
         }
      };
      self.setDate = function(date) {
         if (self.validDate(date)) {
            var dateArray = date.split("-");
            self.date.month = dateArray[1];
            self.date.day = dateArray[2];
            self.date.year = dateArray[0];
         } else {
            console.log("the set date string was not a valid date");
         }
         console.log(self.date)
      };

      self.formatISOdate = function() {
         if (!self.time.hour) {
            console.log("the time was not set");
         }
         self.dateObject.setHours(self.time.hour);
         self.dateObject.setMinutes(self.time.minute);

         if (self.date.day && self.date.month && self.date.year) {
            self.dateObject.setDate(self.date.day);
            console.log(self.dateObject)

            //the set month ranges from 0 to 11 for some reason so the -1 is to correct for that
            self.dateObject.setMonth(self.date.month - 1);
            self.dateObject.setFullYear(self.date.year);
         }
         self.ISOstring = self.dateObject;

      };

      self.getTodaysDate = function(val) {
         var t = new Date(),
            day, month, year = t.getFullYear();
         if (t.getDate() < 10) {
            day = "0" + t.getDate();
         } else {
            day = t.getDate();
         }
         if ((t.getMonth() + 1) < 10) {
            month = "0" + (t.getMonth() + 1 - val);
         } else {
            month = t.getMonth() + 1 - val;
         }
         return (year + '-' + month + '-' + day);
      };

      $("#dateInput").datepicker({
         dateFormat: 'yy-mm-dd',
         showAnim: "slideDown",
         minDate: 0
      }).val(self.getTodaysDate(0));
      $("#inputLabel").addClass('is-completed');

      self.loadCal = function() {
         $("#dateInput").datepicker({
            dateFormat: 'yy-mm-dd',
            minDate: 0
         }).val(self.getTodaysDate(0));
         $("#inputLabel").addClass('is-completed');
      };
      //get a UTC string and convert it to the local form of time display
      self.UTCtoString = function(utcString) {
         //get the time in the database, convert it into an object
         var dateObject = new Date(utcString);

         var hours = dateObject.getHours();
         if (hours > 12) {
            hours -= 12;
         }
         var minutes = dateObject.getMinutes();
         //if the minutes are a single digit
         if (minutes < 10) {
            minutes = "0" + minutes.toString();
         }

         //get the hour:minutes
         var dateString = hours + ":" + minutes;
         //set that as our new time
         return dateString;
      };
      return self;
   });
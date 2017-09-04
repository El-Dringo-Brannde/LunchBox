'use strict';

/**
 * @ngdoc service
 * @name lunchBoxApp.joinGroupService
 * @description
 * # joinGroupService
 * Service in the lunchBoxApp.
 */
angular.module('lunchBoxApp')
   .service('joinGroupService', function($cookies, toastr) {
      var self = this;

      function isOwner(fullName, username) {
         if (fullName == $cookies.getObject("user").full || username == $cookies.getObject("user").username) {
            return true;
         }
         return false;
      }

      self.joinGroup = function(group) {
         //if they are the owner of the group, throw an error and return false
         if (isOwner(group.full, group.username)) {
            toastr("You the founder of this group!", "warning");
            return false;
         }

         //go through each person in the list of people going
         for (var i = 0; i < group.restaurant.peopleGoing.length; i++) {
            //if they are there then thow and error and return false
            if (group.restaurant.peopleGoing[i] === $cookies.getObject("user").full) {
               toastr("You are already part of that group", "warning");
               self.isActive = true;
               return false;
            }
         }
         // if the carSeating exists and the number of people going is greater than the limit
         if (group.restaurant.sizeLimit && (group.restaurant.peopleGoing.length + 1) >= parseInt(group.restaurant.sizeLimit)) {
            // throw an error
            toastr("Group Limit Reached", "error");
            // reject them from joining
            return false;
         }

         return true;
      };
      return self;
   });
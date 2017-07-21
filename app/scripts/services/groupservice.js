'use strict';

/**
 * @ngdoc service
 * @name lunchBoxApp.groupService
 * @description
 * # groupService
 * Service in the lunchBoxApp.
 */
angular.module('lunchBoxApp')
   .service('groupService', function () {
      var self = this;
      self.groupDetails = function (group) {
         console.log(group)
         console.log(group.peopleGoing.length)
         var peopleGoing = group.peopleGoing.toString();
         var bonusInfo = {
            user: group.fullName,
            email: group.email,
            peopleGoing: peopleGoing,
            peopleGoingCount:  group.peopleGoing.length,
            travelMethod: group.travelMethod,
            time: group.time,
            where: group.restaurant.name,
            address: group.restaurant.address
         };
         return bonusInfo;
      };
      return self;
   });

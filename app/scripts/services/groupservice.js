'use strict';

/**
 * @ngdoc service
 * @name lunchBoxApp.groupService
 * @description
 * # groupService
 * Service in the lunchBoxApp.
 */
angular.module('lunchBoxApp')
   .service('groupService', function() {
      var self = this;
      self.groupDetails = function(group) {
         var peopleGoing = group.peopleGoing.toString();
         var bonusInfo = {
            user: group.fullName,
            email: group.email,
            peopleGoing: peopleGoing,
            peopleGoingCount: group.peopleGoing.length,
            travelMethod: group.travelMethod,
            time: group.time,
            where: group.restaurant.name,
            address: group.restaurant.address,
            website: group.restaurant.url,
            yelp: group.restaurant.yelp,
            rating: group.restaurant.rating,
            phone: group.restaurant.phone

         };
         return bonusInfo;
      };
      return self;
   });
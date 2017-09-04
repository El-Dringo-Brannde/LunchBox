'use strict';

/**
 * @ngdoc service
 * @name lunchBoxApp.groupService
 * @description
 * # groupService
 * Service in the lunchBoxApp.
 */
angular.module('lunchBoxApp')
   .service('groupService', function(timeService) {
      var self = this;
      self.groupDetails = function(group) {
         var bonusInfo = {
            peopleGoing: group.restaurant.peopleGoing,
            peopleGoingCount: group.peopleGoingCount,
            rating: group.restaurant.rating,
            host: group.host,
            restaurant: group.restaurant
         };
         if (bonusInfo.restaurant.time.length > 6) // if not in hh:mm format
            bonusInfo.restaurant.time = timeService.UTCtoString(bonusInfo.restaurant.time);
         if (group.restaurant.peopleGoing)
            bonusInfo.restaurant.peopleGoing = group.restaurant.peopleGoing;
         return bonusInfo;
      };
      return self;
   });
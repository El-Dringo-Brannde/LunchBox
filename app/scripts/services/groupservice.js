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
      var peopleGoing = group.peopleGoing.toString().split(", ")
      console.log(peopleGoing)
      var bonusInfo = {
        user: group.fullName,
        peopleGoing: peopleGoing,
        peopleGoingCount: group.peopleGoingCount,
        travelMethod: group.travelMethod,
        time: group.time,
        where: group.restaurant.name,
        address: group.restaurant.address
      }
      console.log("poop")
      return bonusInfo
    }
    return self
  });

'use strict';

/**
 * @ngdoc service
 * @name lunchBoxApp.lunchservice
 * @description
 * # lunchservice
 * Service in the lunchBoxApp.
 */
angular.module('lunchBoxApp')
  .service('lunchservice', function () {
    var self = this;
    self.loadDetails = function (group) {
      var bonusInfo = {
        userName: group.userName,
        peopleGoing: group.peopleGoing,
        travelMethod: group.travelMethod,
        time: group.time,
        location: {
          name: group.location.name,
          menu: group.location.menu,
          addr: group.location.addr,
        },
        extra: {
          rating: group.extra.rating,
          cuisine: group.extra.cuisine,
        }
      }
      return bonusInfo
    }
    return self
  });

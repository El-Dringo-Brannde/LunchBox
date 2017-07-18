'use strict';

/**
 * @ngdoc service
 * @name lunchBoxApp.lunchservice
 * @description
 * # lunchservice
 * Service in the lunchBoxApp.
 */
angular.module('lunchBoxApp')
  .service('lunchservice', function ($rootScope) {
    var self = this;
    self.loadDetails = function (group, httpResults) {
      var bonusInfo = {
        userName: group.username,
        peopleGoing: group.peopleGoing,
        travelMethod: group.travelMethod,
        time: group.time,
        location: {
          name: httpResults.name,
          menu: httpResults.menu_url,
          addr: httpResults.location.address,
        },
        extra: {
          rating: httpResults.user_rating.aggregate_rating,
          cuisine: httpResults.cuisines,
        }
      }
      $rootScope.$broadcast("dataPopulated")
      return bonusInfo
    }
    return self
  });

'use strict';

/**
 * @ngdoc service
 * @name lunchBoxApp.mapService
 * @description
 * # mapService
 * Service in the lunchBoxApp.
 */
angular.module('lunchBoxApp')
   .service('mapService', function() {
      var self = this;

      //offices that CDK owns
      self.officeLocation = {
         "Portland": {
            lat: 45.504023,
            lng: -122.679433
         },
         "Seattle": {
            lat: 47.5971064,
            lng: -122.3307503
         },
         "Hoffman Estates": {
            lat: 42.0632679,
            lng: -88.1302837
         },
         "Pune": {
            lat: 18.5561171,
            lng: 73.8897303
         },
         "Hyderabad": {
            lat: 17.4376587,
            lng: 78.3824284
         },
         "Hungerford": {
            lat: 51.4198961,
            lng: -1.5166144
         },
         "Detroit": {
            lat: 42.3300717,
            lng: -83.0471153
         },
         "Austin": {
            lat: 30.381929,
            lng: -97.815219
         },
         "Other": {
            lat: 45.704023,
            lng: -122.679433
         }
      };

      //returns an array of all the office names
      self.getOfficeNames = function() {
         var officeNames = [];
         for (var location in self.officeLocation) {
            officeNames.push(location);
         }
         return officeNames;
      };

      self.getOffice = function(name) {
         return self.officeLocation[name];
      };

      return self;
   });

'use strict';

/**
 * @ngdoc service
 * @name lunchBoxApp.commService
 * @description
 * # commService
 * Service in the lunchBoxApp.
 */
angular.module('lunchBoxApp')
   .service('commService', function () {
      var self = this;
      var myData = {};
      self.pipe = {
         set: function (data) {
            for (var i in data) {
               myData[i] = data[i];
            }
         },
         get: function () {
            return myData;
         },
         reset: function () {
            myData = {};
         }
      };
      return self.pipe;
   });

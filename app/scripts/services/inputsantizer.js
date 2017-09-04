'use strict';

/**
 * @ngdoc service
 * @name lunchBoxApp.inputSantizer
 * @description
 * # inputSantizer
 * Service in the lunchBoxApp.
 */
angular.module('lunchBoxApp')
   .service('inputSanitizer', function(toastr) {
      var self = this;
      self.users = {
         showError: function(user) {
            toastr(user + " is not a user of LunchBox!", "error");
         }
      };
      self.location = {};

      return self;
   });
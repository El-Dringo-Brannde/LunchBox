'use strict';

/**
 * @ngdoc service
 * @name lunchBoxApp.pictureService
 * @description
 * # pictureService
 * Service in the lunchBoxApp.
 */
angular.module('lunchBoxApp')
   .service('pictureService', function() {
      var self = this;
      //if the profile pic is empty, it will return the default photo for missing pictures
      self.addDefaultPhoto = function(pic) {
         //if the profile picture does not exist, set a default one
         if (pic === "" || pic === null || pic === undefined) {
            pic = "http://santetotal.com/wp-content/uploads/2014/05/default-user.png";
         }
         return pic;
      };
      return self;
   });
'use strict';

/**
 * @ngdoc service
 * @name lunchBoxApp.requestFoodService
 * @description
 * # requestFoodService
 * Service in the lunchBoxApp.
 */
angular.module('lunchBoxApp')
   .service('requestFoodService', function(toastr, $cookies) {
      var self = this;

      self.requestHelper = function(requestObj) {
         if (requestObj.food && requestObj.payment) {
            var submissionObj = {
               courier: {
                  name: requestObj.groupInfo.fullName,
                  username: requestObj.groupInfo.username,
                  email: requestObj.groupInfo.email
               },
               food: {
                  pay: requestObj.payment,
                  meal: requestObj.food
               },
               requester: {
                  name: $cookies.getObject("user").full,
                  username: $cookies.getObject("user").username,
                  email: $cookies.getObject("user").mail,
               },
               place: {
                  name: requestObj.groupInfo.restaurant.name,
                  address: requestObj.groupInfo.restaurant.address,
                  website: requestObj.groupInfo.restaurant.website,
                  time: requestObj.groupInfo.time
               }
            };
            return submissionObj;
         } else {
            toastr("Both order fields required", "warning");
         }
      };
      return self;
   });
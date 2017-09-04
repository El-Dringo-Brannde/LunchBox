'use strict';

/**
 * @ngdoc filter
 * @name lunchBoxApp.filter:notificationTypes
 * @function
 * @description
 * # notificationTypes
 * Filter in the lunchBoxApp.
 */
angular.module('lunchBoxApp')
   .filter('notificationTypes', function() {
      return function(input, filterType) {
         if (input) {
            return input.filter(function(ele) {
               if (ele.type === filterType || ele.type === filterType + "d" ||
                  ele.type === filterType + "ed")
                  return ele;
            });
         }
      };
   });
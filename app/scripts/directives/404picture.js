'use strict';

/**
 * @ngdoc directive
 * @name lunchBoxApp.directive:404Picture
 * @description
 * # 404Picture
 */
angular.module('lunchBoxApp')
   .directive('errSrc', function() {
      return {
         link: function(scope, element, attrs) {
            element.bind('error', function() {
               if (attrs.src != attrs.errSrc) {
                  attrs.$set('src', attrs.errSrc);
               }
            });
            var err = "https://image.freepik.com/free-icon/user-male-silhouette_318-55563.jpg";
            attrs.$observe('ngSrc', function(value) {
               if (!value && attrs.errSrc) {
                  attrs.$set('src', err);
               }
            });
         }
      }
   });
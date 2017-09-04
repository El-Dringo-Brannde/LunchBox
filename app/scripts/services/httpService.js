'use strict';

/**
 * @ngdoc service
 * @name lunchBoxApp.httpService
 * @description
 * # httpService
 * Service in the lunchBoxApp.
 */

angular.module('lunchBoxApp')
   .service('httpService', ['$http', function($http) {

      var pathArray = location.href.split('/'),
         protocol = pathArray[0],

         hostComponents = pathArray[2].split(':'),
         host = hostComponents[0],
         UIport = hostComponents[1],
         serverPort = "8080",

         baseUrl = protocol + "//" + host,
         serverPath = baseUrl + ":" + serverPort + "/",
         UIpath = baseUrl + ":" + UIport + "/";

      this.getBaseUrl = function() {
         return baseUrl;
      };

      this.getBaseUrl = function(customPort) {
         return baseUrl + ":" + customPort + "/";
      };

      this.getServerPath = function() {
         return "!!SERVERPATH!!";
      }

      this.getUser = function(query) {
         return $http.get("!!SERVERPATH!!" + query);
      };

      this.getYelp = function(yelpObj) {
         return $http.get("!!SERVERPATH!!" + 'yelp?phone=' + yelpObj);
      };

      this.putObj = function(query, obj) {
         return $http.put("!!SERVERPATH!!" + query, obj);
      };

      this.postUser = function(obj) {
         return $http.post("!!SERVERPATH!!" + 'user', obj);
      };

      this.profilePut = function(type, obj) {
         return $http.put("!!SERVERPATH!!" + type, obj);
      };
      this.delete = function(obj) {
         return $http.post("!!SERVERPATH!!" + 'event', obj);
      };
   }]);
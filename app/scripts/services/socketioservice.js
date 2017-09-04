'use strict';

/**
 * @ngdoc service
 * @name lunchBoxApp.socketIOService
 * @description
 * # socketIOService
 * Service in the lunchBoxApp.
 */
angular.module('lunchBoxApp')
   .service('socketIOService', function($cookies, $rootScope, httpService) {
      var bigObj = {
         set: false,
         init: function(location) {
            if (bigObj.set === true) {
               return;
            }
            const socket = io("!!host!!") // hack to get socket.IO running 
            socket.emit("connection");
            socket.on("connected!", function() {
               console.log("We have been connected!");
            });
            socket.on('userUpdate', function(msg) {
               $rootScope.$broadcast("userUpdate", msg);
            });
            socket.on('eventRemoved', function(msg) {
               $rootScope.$broadcast("eventRemoved", msg);
            });
            socket.on('userLeft', function(msg) {
               $rootScope.$broadcast("userLeft", msg);
            });
            socket.on('peoplePushed', function(msg) {
               $rootScope.$broadcast("peoplePushed", msg);
            });
            socket.on(location + "_notifications", function(msg) {
               $rootScope.$broadcast(location + "_notifications", msg);
            });
            bigObj.set = true;
         }
      };
      return bigObj;
   });
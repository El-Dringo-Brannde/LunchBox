/*global $*/

'use strict';

/**
 * @ngdoc function
 * @name lunchBoxApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the lunchBoxApp
 */
angular.module('lunchBoxApp')
   .controller('ProfileCtrl', function($scope, $cookies, $http, commService, $rootScope, navbar) {
      navbar();
      var curUser = $cookies.getObject("user").full.split(",");
      var curUserName = $cookies.getObject("user").userName.split(",");
      $scope.user = curUser.pop();
      $http.get("http://localhost:3005/getUser?name=" + curUserName)
         .then((resp) => $scope.user = resp.data[0]);

      function getCurFriends() {
         $http.get("http://localhost:3005/getUser?name=" + curUserName)
            .then((resp) => {
               $scope.friends = resp.data[0].friends;
            });
      }

      var bigObj = {};
      $http.get("http://localhost:3005/allUsers").then(function(resp) {
         var lunchBoxUsers = [];
         resp.data.forEach(function(ele) {
            bigObj[ele.fullName] = ele.username;
            lunchBoxUsers.push(ele.fullName);
         });
         $("#friendSearch").autocomplete({
            source: lunchBoxUsers
         });
      }); // for the autocomplete feature

      $scope.addFriend = function() {
         $http.get("http://localhost:3005/getUser?name=" + bigObj[$scope.friendSearch])
            .then((resp) => {
               $http.put("http://localhost:3005/addFriend", {
                  user: $cookies.getObject("user").userName,
                  friend: {
                     fullName: resp.data[0].fullName,
                     username: resp.data[0].username,
                     email: resp.data[0].email
                  }
               }).then(function(resp) {
                  getCurFriends();
                  $scope.friendSearch = "";
               });
            });
      };
      getCurFriends();
   });
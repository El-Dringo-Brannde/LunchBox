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
      navbar()
      var curUser = $cookies.getObject("user").full.split(",")
      var curUserName = $cookies.getObject("user").userName.split(",")
      $scope.user = curUser.pop() + " " + curUser[0];

      function getCurFriends() {
         $http.get("http://localhost:3005/getUser?name=" + curUserName)
            .then((resp) => $scope.friends = resp.data[0].friends);
      }

      $http.get("http://localhost:3005/allUsers").then(function(resp) {
         var lunchBoxUsers = [];
         resp.data.forEach(function(ele) {
            lunchBoxUsers.push(ele.fullName);
         });
         $("#friendSearch").autocomplete({
            source: lunchBoxUsers
         });
      });
      $scope.addFriend = function() {
         $http.put("http://localhost:3005/addFriend", {
            name: $cookies.getObject("user").userName,
            friend: $scope.friendSearch
         }).then(function() {
            getCurFriends();
            $scope.friendSearch = "";
         });
      };
      getCurFriends();
   });
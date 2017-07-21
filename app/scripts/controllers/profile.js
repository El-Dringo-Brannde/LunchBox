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
   .controller('ProfileCtrl', function ($scope, $cookies, $http, commService, $rootScope, navbar) {

      var baseUrl = "http://localhost:3005/";

      navbar();
      var curUser = $cookies.getObject("user").full.split(",");
      var curUserName = $cookies.getObject("user").userName.split(",");
      $scope.user = curUser.pop();
      $http.get("http://localhost:3005/getUser?name=" + curUserName)
         .then((resp) => {
            $scope.user = resp.data[0];
            resp.data[0].profilePic == "" ? $scope.user.profilePic =
               "https://image.freepik.com/free-icon/user-male-silhouette_318-55563.jpg" : null;
         });

    function getCurFriends() {
      $http.get("http://localhost:3005/getUser?name=" + curUserName)
        .then((resp) => {
          $scope.friends = resp.data[0].friends;
        });
    }

      var bigObj = {};
      $http.get("http://localhost:3005/allUsers").then(function (resp) {
         var lunchBoxUsers = [];
         resp.data.forEach(function (ele) {
            bigObj[ele.fullName] = ele.username;
            lunchBoxUsers.push(ele.fullName);
         });
         $("#friendSearch").autocomplete({
            source: lunchBoxUsers
         });
      }); // for the autocomplete feature

      $scope.addFriend = function () {
         $http.get(baseUrl + "getUser?name=" + bigObj[$scope.friendSearch])
            .then((resp) => {
               $http.put(baseUrl + "addFriend", {
                  user: $cookies.getObject("user").userName,
                  friend: {
                     fullName: resp.data[0].fullName,
                     username: resp.data[0].username,
                     email: resp.data[0].email
                  }
               }).then(function (resp) {
                  getCurFriends();
                  $scope.friendSearch = "";
               });
            });
      };
      getCurFriends();

      if ($scope.userImage === undefined) {
         $scope.userImage = "https://image.freepik.com/free-icon/user-male-silhouette_318-55563.jpg";
      }

      $scope.getImage = function () {
         $scope.githubUsername;
         var githubApi = "https://api.github.com/users/";
         $http.get(githubApi + $scope.githubUsername).then(function (result) {
            var data = result.data;
            if (result.data !== undefined) {
               $scope.userImage = data.avatar_url;
            }
         });
      };

    function getFoodFaves() {
      $http.get("http://localhost:3005/getUser?name=" + curUserName)
        .then((response) => {
          $scope.favorites = response.data[0].favorites;
        })
    }
    bigObj = {};
    $http.get("http://localhost:3005/allUsers").then(function (resp) {
      var lunchBoxUsers = [];
      resp.data.forEach(function (ele) {
        bigObj[ele.fullName] = ele.username;
        lunchBoxUsers.push(ele.fullName);
      });
      $("#friendSearch").autocomplete({
        source: lunchBoxUsers
      });
    }); // for the autocomplete feature
    $scope.addFriend = function () {
      $http.get("http://localhost:3005/getUser?name=" + bigObj[$scope.friendSearch])
        .then((resp) => {
          $http.put("http://localhost:3005/addFriend", {
            user: $cookies.getObject("user").userName,
            friend: {
              fullName: resp.data[0].fullName,
              username: resp.data[0].username,
              email: resp.data[0].email
            }
          }).then(function (resp) {
            getCurFriends();
            $scope.friendSearch = "";
          });
        });
    };

    $scope.addFavorite = function () {
      $http.put("http://localhost:3005/addFavorite", {
        name: $cookies.getObject("user").userName,
        place: {
            name: $scope.foodfav
        }
      }).then(function (resp) {
        getFoodFaves();
        $scope.foodfav = "";
      });
    };

    getFoodFaves();
    getCurFriends();
  });


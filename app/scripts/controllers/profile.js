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
    navbar();
    var curUser = $cookies.getObject("user").full.split(",");
    var curUserName = $cookies.getObject("user").userName.split(",");
    $scope.user = curUser.pop();

    function getCurFriends() {
      $http.get("http://localhost:3005/getUser?name=" + curUserName)
        .then((resp) => {
          $scope.friends = resp.data[0].friends;
        });
    }

    function getFoodFaves() {
      $http.get("http://localhost:3005/getUser?name=" + curUserName)
        .then((response) => {
          $scope.favorites = response.data[0].favorites;
        })
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
          console.log($scope.foodfav)
          console.log($cookies.getObject("user").userName)
      $http.put("http://localhost:3005/addFavorite", {
        name: $cookies.getObject("user").userName,
        place: {
            name: $scope.foodfav
        }
      }).then(function (resp) {
        console.log(resp)
        getFoodFaves();
        $scope.foodfav = "";
      });
    }

    getFoodFaves();
    getCurFriends();
  });

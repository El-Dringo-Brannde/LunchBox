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
    $(".navBtn").each(function (i, ele) {
      $(ele).css("color", "#578bff")
    });
    $("#profileLink").css("color", "#82c600");
    var baseUrl = "http://localhost:3005/";
    $scope.foundPhoto = false;

    navbar();
    var curUser = $cookies.getObject("user").full.split(",");
    var curUserName = $cookies.getObject("user").userName.split(",");
    $scope.user = curUser.pop();
    $http.get(baseUrl + "getUser?name=" + curUserName)
      .then(function (resp) {
        $scope.user = resp.data[0];
        if (resp.data[0].profilePic === "") {
          $scope.user.profilePic = "https://www.clker.com/cliparts/5/9/4/c/12198090531909861341man%20silhouette.svg.med.png";
        }
      });

    //get users current friends for profile  
    function getCurFriends() {
      $http.get(baseUrl + "getUser?name=" + curUserName)
        .then(function (resp) {
          $scope.friends = resp.data[0].friends;
          if (resp.data[0].profilePic === "") {
            $scope.userImage = "https://www.clker.com/cliparts/5/9/4/c/12198090531909861341man%20silhouette.svg.med.png";
          } else {
            $scope.userImage = resp.data[0].profilePic;
            $scope.foundPhoto = true;
          }
        });
    }

    //add users to object for autocomplete
    var bigUserObj = {};
    $http.get(baseUrl + "allUsers").then(function (resp) {
      var lunchBoxUsers = [];
      resp.data.forEach(function (ele) {
        bigUserObj[ele.fullName] = ele.username;
        lunchBoxUsers.push(ele.fullName);
      });
      $("#friendSearch").autocomplete({
        source: lunchBoxUsers
      });
    });

    //add friends (not mutual *wink wink*)
    $scope.addFriend = function () {
      $http.get(baseUrl + "getUser?name=" + bigUserObj[$scope.friendSearch])
        .then(function (resp) {
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

    //Set profile image to users github image
    $scope.getImage = function () {
      var githubApi = "https://api.github.com/users/";
      $http.get(githubApi + $scope.githubUsername).then(function (result) {
        var data = result.data;
        if (result.data !== undefined) {
          $scope.userImage = data.avatar_url;
          $scope.foundPhoto = true;
        }
        $http.put(baseUrl + "/photo", {
          userName: curUserName[0],
          picture: data.avatar_url
        }).then(function (resp) {
          console.log(resp)
        });
      });
    };

    //get users favorite foods for profile
    function getFoodFaves() {
      $http.get(baseUrl + "getUser?name=" + curUserName)
        .then(function (response) {
          $scope.favorites = response.data[0].favorites;
        });
    }

    //add new favorite to database
    $scope.addFavorite = function () {
      $http.put(baseUrl + "addFavorite", {
        name: $cookies.getObject("user").userName,
        place: {
          name: $scope.newFavorite
        }
      }).then(function (resp) {
        getFoodFaves();
        $scope.newFavorite = "";
      });
    };

    getFoodFaves();
    getCurFriends();
  });

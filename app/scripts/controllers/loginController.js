/* global alert */

'use strict';

/**
 * @ngdoc function
 * @name lunchBoxApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the lunchBoxApp
 */
angular.module('lunchBoxApp')
  .controller('loginController', function ($scope, $http, $cookies, $window, commService, $rootScope) {
    $scope.loginName = "";
    $scope.currentUser = "";
    $scope.userLogin = false;
    $rootScope.$broadcast("hideNav")

    function setCommService(curUser, userAccName) {
      commService.set({
        name: curUser,
        userName: userAccName,
        showNav: true
      });
    }

    function createOrLoginUser(idx, cur) {
      setCommService($scope.currentUser, cur.user[idx].sAMAccountName);
      var cleanName = cur.user[idx].cn.split(",")
      cleanName = cleanName[1] + " " + cleanName[0];
      $scope.currentUser = cur.user[idx].cn;
      $cookies.putObject("user", {
        full: cleanName,
        userName: cur.user[idx].sAMAccountName
      });
      $http.post("http://localhost:3005/addUser", {
          username: cur.user[idx].sAMAccountName,
          full: cleanName,
          mail: cur.user[idx].mail
        })
        .then(function (succ) {
          $window.location.href = '/#/';
        }, function (err) {
          alert(err);
        });
    }
    $scope.signIn = function () {
      if ($scope.loginName.length == 0)
        alert("Invalid Username")
      else {
        $http.get('http://ffg.cdk.com:4000/find/user/' + $scope.loginName).then(function success(response) {
          if ($scope.currentUser = response.data.user.length == 0)
            alert('invalid username');
          else if (response.data.user.length > 1) {
            for (var i = 0; i < response.data.user.length; i++) {
              if (response.data.user[i].sAMAccountName == $scope.loginName)
                createOrLoginUser(i, response.data)
            }
          } else
            createOrLoginUser(0, response.data)
        });
      }
    };
  });

/* global alert */

'use strict';

/**
 * @ngdoc function
 * @name lunchBoxApp.controller:loginController
 * @description
 * # loginController
 * Controller for the login page of lunchBox
 */
angular.module('lunchBoxApp')
   .controller('loginController', function($scope, $http, $cookies, $window,
      commService, $rootScope, httpService, $location) {
      $scope.loginName = "";
      $scope.currentUser = "";
      $scope.userLogin = false;
      $rootScope.$broadcast("hideNav");

      function setCommService(curUser, userAccName) {
         commService.set({
            name: curUser,
            username: userAccName,
            showNav: true
         });
      }

      //When lighthouse gets more photos for users, this is the base URL to use
      //  "http://lighthouse.cdk.com/images/"

      function createOrLoginUser(user) {

         var cleanName = user.cn.split(",");
         cleanName = cleanName[1].trim() + " " + cleanName[0];

         $scope.currentUser = user.cn;

         $cookies.putObject("user", {
            full: cleanName,
            username: user.sAMAccountName,
            mail: user.mail,
            officeLoc: user.l
         });

         setCommService($scope.currentUser, user.sAMAccountName);

         httpService.postUser({
            username: user.sAMAccountName,
            full: cleanName,
            mail: user.mail,
            location: user.l,
            profilePic: ""
         }).then(function() {
            $location.path("/");
         }, function(err) {
            alert("there was a problem posting your info to the database");
         });
      }

      $scope.signIn = function() {
         if ($scope.loginName) {
            //check to see if the user exists
            $http.get('http://ffg.cdk.com:4000/find/user/' + $scope.loginName)
               .then(function success(response) {
                  //if more than one user is returned
                  if (response.data.user.length > 1) {
                     //for each user returned
                     response.data.user.forEach(function(user) {
                        //if their names match
                        if (user.sAMAccountName === $scope.loginName) {
                           createOrLoginUser(user);
                        }
                     });
                     //if the response has a single user in it
                  } else if (response.data.user.length === 1) {
                     createOrLoginUser(response.data.user[0]);
                  } else {
                     alert('Sorry, that username does not exist in the database');
                  }
               });
         } else {
            alert("Invalid username");
         }
      };
   });

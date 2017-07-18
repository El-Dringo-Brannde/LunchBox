'use strict';

/**
 * @ngdoc function
 * @name lunchBoxApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the lunchBoxApp
 */
angular.module('lunchBoxApp')
   .controller('loginController', function($scope, $http, $cookies, $window, commService) {
      $scope.loginName = "";
      $scope.currentUser = "";
      // create a message to display in our view 
      $scope.message = 'Everyone come and see how good I look!';
      $scope.signIn = function() {
         if ($scope.loginName.length == 0) {
            console.log("Invalid Username")
         } else {
            console.log("success, submitting request")
            $scope.request = $http({
               method: 'GET',
               url: 'http://ffg.cdk.com:4000/find/user/' + $scope.loginName
            }).then(function success(response) {
               console.log(response)
               if ($scope.currentUser = response.data.user.length == 0) {
                  console.log("ERROR BRUH")
               } else {
                  $scope.currentUser = response.data.user[0].cn
                  $cookies.put("user", $scope.currentUser)
                  commService.set({
                     name: $scope.currentUser
                  });
                  $window.location.href = '/#/';
               }
            })
         }
      }
   });
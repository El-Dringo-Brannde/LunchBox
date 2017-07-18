'use strict';

/**
 * @ngdoc function
 * @name lunchBoxApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the lunchBoxApp
 */
angular.module('lunchBoxApp')
   .controller('loginController', function($scope, $http, $cookies, $window, commService, $rootScope) {
      $scope.loginName = "";
      $scope.currentUser = "";
      $scope.userLogin = false;
      $rootScope.$broadcast("hideNav")
      // create a message to display in our view 
      $scope.message = 'Everyone come and see how good I look!';
      $scope.signIn = function() {
         if ($scope.loginName.length == 0) {
            alert("Invalid Username")
         } else {
            $scope.request = $http({
               method: 'GET',
               url: 'http://ffg.cdk.com:4000/find/user/' + $scope.loginName
            }).then(function success(response) {
               if ($scope.currentUser = response.data.user.length == 0) {
                  alert('invalid username');
               } else if (response.data.user.length > 1) {
                  for (var i = 0; i < response.data.user.length; i++) {
                     if (response.data.user[i].sAMAccountName == $scope.loginName) {
                        $scope.currentUser = response.data.user[i].cn
                        $cookies.put("user", $scope.currentUser)
                        commService.set({
                           name: $scope.currentUser,
                           showNav: true
                        })
                        $rootScope.$broadcast("showNav") 
                        $window.location.href = '/#/';
                     }
                  }
               } else {
                  $scope.currentUser = response.data.user[0].cn
                  $cookies.put("user", $scope.currentUser)
                  commService.set({
                     name: $scope.currentUser,
                     showNav: true
                  });
                  $rootScope.$broadcast("showNav") 
                  $window.location.href = '/#/';
               }
            })
         }
      }

   });
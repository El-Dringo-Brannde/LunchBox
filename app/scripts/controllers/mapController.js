/*global google, map*/

angular.module('lunchBoxApp')
   .controller('mapController', function($scope, $rootScope, $window) {
      'use strict';
      var infowindow;
      var myLocation;
      var service;
      var restaurant = {
         name: "",
         address: ""
      };

      var theStyle = [{
         featureType: "poi",
         elementType: "labels",
         stylers: [{
            visibility: "off"
         }]
      }];
      myLocation = { // hardcoded Portland location
         lat: 45.504023,
         lng: -122.679433
      };

      $window.map = new google.maps.Map(document.getElementById('map'), {
         center: myLocation,
         scrollwheel: false,
         zoom: 14
      });

      $window.map.set('styles', theStyle);

      // mark restaurants within 5000 radius
      function createMarker(place) {
         var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location
         });

         google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(place.name);
            infowindow.open(map, this);
            restaurant.name = place.name;
            restaurant.address = place.vicinity;
            $rootScope.$emit("mapLocationClick", restaurant);
         });
      }

      infowindow = new google.maps.InfoWindow();
      service = new google.maps.places.PlacesService(map);
      service.nearbySearch({
         location: myLocation,
         radius: 5000,
         type: 'restaurant'
      }, function(results, status) {
         if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
               createMarker(results[i]);
            }
         }
      });
      service.nearbySearch({
         location: myLocation,
         radius: 10000,
         type: "cafe"
      }, function(results, status) {
         if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
               createMarker(results[i]);
            }
         }
      });
      service.nearbySearch({
         location: myLocation,
         radius: 10000,
         type: 'bar'
      }, function(results, status) {
         if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
               createMarker(results[i]);
            }
         }
      });
   });
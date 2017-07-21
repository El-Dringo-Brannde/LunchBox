/*global google, map*/

angular.module('lunchBoxApp')
   .controller('mapController', function($scope, $rootScope, $window) {
      'use strict';
      var infowindow;
      var myLocation;
      var service;
      var markers = [];
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
      // Create the search box and link it to the UI element.
      var input = document.getElementById('pac-input');
      $window.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
      var searchBox = new google.maps.places.SearchBox(input);


      function createMarker(place) {
         var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location
         });

         // add listeners to the click events to send to another controller
         google.maps.event.addListener(marker, 'click', function() {
            console.log(place)
            infowindow.setContent(place.name);
            infowindow.open(map, this);
            restaurant.name = place.name;
            restaurant.address = place.vicinity;
            restaurant.website = place.website;
            restaurant.phone = place.international_phone_number;
            restaurant.rating = place.rating;
            restaurant.yelp = place.international_phone_number
            $rootScope.$emit("mapLocationClick", restaurant);
         });
      }


      google.maps.event.addListener(searchBox, 'places_changed', function() {
         var places = searchBox.getPlaces();
         console.log(places)
         markers.forEach(function(marker) {
            marker.setMap(null);
         });
         markers = [];

         if (places.length == 0)
            return;

         for (var i = 0, marker; marker = markers[i]; i++)
            marker.setMap(null);


         // For each place, get the icon, place name, and location.
         var bounds = new google.maps.LatLngBounds();
         for (var i = 0, place; place = places[i]; i++) {
            var image = {
               url: place.icon,
               size: new google.maps.Size(71, 71),
               origin: new google.maps.Point(0, 0),
               anchor: new google.maps.Point(17, 34),
               scaledSize: new google.maps.Size(25, 25)
            };
            createMarker(place);
            markers.push(marker);

            if (place.geometry.viewport)
               bounds.union(place.geometry.viewport);
            else
               bounds.extend(place.geometry.location);
         }
         $window.map.fitBounds(bounds);
      });

      infowindow = new google.maps.InfoWindow();
      service = new google.maps.places.PlacesService(map);
      service.nearbySearch({
         location: myLocation,
         radius: 5000,
         type: 'restaurant'
      }, function(results, status) {
         if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
               service.getDetails(results[i], function(res) {
                  createMarker(res);
               });
            }
         }
      });
   });
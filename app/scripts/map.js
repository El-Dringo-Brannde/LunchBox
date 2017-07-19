/* global google */

var map;
var infowindow;
var myLocation;
var service;
var restaurant = {
   name: "",
   address: ""
};

var theStyle = [
   {
      featureType: "poi",
      elementType: "labels",
      stylers: [
         {
            visibility: "off"
         }
      ]
   }
];

function initMap() {
   'use strict';

   myLocation = { // hardcoded Portland location
      lat: 45.504023,
      lng: -122.679433
   };

   map = new google.maps.Map(document.getElementById('map'), {
      center: myLocation,
      zoom: 14
   });

   map.set('styles', theStyle);

   infowindow = new google.maps.InfoWindow();
   service = new google.maps.places.PlacesService(map);
   service.nearbySearch({
      location: myLocation,
      radius: 5000,
      type: ['restaurant']
   }, function (results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
         for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
         }
      }
   });
}

function createMarker(place) { // mark restaurants within 5000 radius
   'use strict';
   var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location
   });

   google.maps.event.addListener(marker, 'click', function () {
      infowindow.setContent(place.name);
      infowindow.open(map, this);
      console.log("name of place: " + place.name + "\naddress: " + place.vicinity);
      restaurant.name = place.name;
      restaurant.address = place.vicinity;
   });
}

angular.module('lunchBoxApp').controller('mapController', function ($scope, $rootScope) {
   'use strict';
   $rootScope.$broadcast(restaurant);
});

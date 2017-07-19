var map;
var infowindow;
var portland;
var service;

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
   portland = {
      lat: 45.504023,
      lng: -122.679433
   };

   map = new google.maps.Map(document.getElementById('map'), {
      center: portland,
      zoom: 14,
   });

   map.set('styles', theStyle)
   
   infowindow = new google.maps.InfoWindow();
   service = new google.maps.places.PlacesService(map);
   service.nearbySearch({
      location: portland,
      radius: 5000,
      type: ['restaurant']
   }, callback);
}

function callback(results, status) {
   'use strict';
   if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
         createMarker(results[i]);
      }
   }
}

function createMarker(place) {
   'use strict';
   var placeLoc = place.geometry.location;
   var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location
   });

   google.maps.event.addListener(marker, 'click', function () {
      infowindow.setContent(place.name);
      infowindow.open(map, this);
   });
}

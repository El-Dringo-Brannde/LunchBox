/* global google, center, getMap */

'use strict';

var map, center;

function createMap(position, zoomLevel) {
   // Create a map object and specify the DOM element for display.
   map = new google.maps.Map(document.getElementById('map'), {
      center: position,
      scrollwheel: true,
      draggable: true,
      zoom: zoomLevel
   });
   var marker = new google.maps.Marker({
      position: position,
      map: map
   });
}

function initMap() {
   var CDK_Portland = {
      lat: 45.504023,
      lng: -122.679433
   };
   createMap(CDK_Portland, 15);
}
/*global $*/
'use strict';
/*global google*/

angular.module('lunchBoxApp')
   .controller('mapController', function($scope, $rootScope, mapService, $cookies) {
      var infowindow;
      var map;
      var service;
      var markers = [];
      $scope.showMap = true;
      var restaurant = {};
      $scope.locationObject = mapService.officeLocation;


      $rootScope.$on("mapChange", function(e, data) {
         initMap(data);
      });

      /*
      The data object takes a:
         host: name of the host (string)
         location: address (string)
         reposition: if you want the map to move to that new location (boolean)
      */
      $rootScope.$on("dropPin", function(e, data) {
         //throw the address into an object so we can query the locaiton ID from google
         var request = {
            location: map.getCenter(),
            radius: '5000',
            query: data.restaurant.address
         };

         //create a service that will look up our location ID
         var service = new google.maps.places.PlacesService(map);

         //search our request and run it through the function when its done
         service.textSearch(request, function(locationDetails, status) {
            //if the search was sucessfull
            if (status == google.maps.places.PlacesServiceStatus.OK) {
               //make a new marker
               var marker = new google.maps.Marker({
                  //put it on our map
                  map: map,
                  //extract our placeID and location
                  place: {
                     placeId: locationDetails[0].place_id,
                     location: locationDetails[0].geometry.location
                  }
               });
            }

            if (data.reposition) {
               map.setCenter(locationDetails[0].geometry.location);
            }

            //put the marker onto our marker array
            markers.push(marker);

            //when they click on the marker, show them a text box with who made the event
            google.maps.event.addListener(marker, 'click', function() {
               infowindow.setContent("Host: " + data.host.full +
                  " <br/> Time: " + data.restaurant.time + " <br/> Place: " + data.restaurant.name);
               infowindow.open(map, this);
            });
         });
      });

      /*
      The location object needs either an adress or GPS coordinant
         address: will get converted into a GPS coordinant
         or
         lattitude and longitude (you know what those are)
      */
      $rootScope.$on("moveMapCenter", function(e, location) {
         if (location.lattitude && location.longitude) {
            map.setCenter({
               lat: location.lattitude,
               lng: location.longitude
            });
         } else if (location.address) {
            //throw the address into an object so we can query the locaiton ID from google
            var request = {
               location: map.getCenter(),
               radius: '5000',
               query: location.address
            };

            //create a service that will look up our location ID
            var service = new google.maps.places.PlacesService(map);

            //search our request and run it through the function when its done
            service.textSearch(request, function(locationDetails, status) {
               //if the search was sucessfull
               if (status == google.maps.places.PlacesServiceStatus.OK) {
                  map.setCenter(locationDetails[0].geometry.location);
               }
            });
         } else {
            console.log("Improper arguments were supplied to the moveMapCenter function");
         }
      });

      // Deletes all markers in the array by removing references to them.
      function deleteMarkers(cur) {
         // clearMarkers(cur);
         for (var i = 0; i < markers.length; i++) {
            if (markers[i] != cur && markers[i] != undefined) {
               markers[i].setMap(null);
            }
         }
         markers = [];
         markers.push(cur);
      }

      //update markers based on new location
      //accepts a marker object
      function createMarker(locationDetails) {
         //if the location details are not null
         if (locationDetails) {
            //make a new marker
            var marker = new google.maps.Marker({
               map: map,
               position: locationDetails.geometry.location
            });
            //push it to the marker list
            markers.push(marker);
            // add listeners to the click events to send to another controller
            google.maps.event.addListener(marker, 'click', function() {
               infowindow.setContent(locationDetails.name);
               infowindow.open(map, this);
               restaurant.name = locationDetails.name;
               restaurant.address = locationDetails.vicinity;
               restaurant.website = locationDetails.website;
               restaurant.phone = locationDetails.international_phone_number;
               restaurant.rating = locationDetails.rating;
               restaurant.yelp = locationDetails.international_phone_number;
               $rootScope.$emit("mapLocationClick", restaurant);
            });
         } else {
            console.log("the location details to createMarker() in mapController were falsey");
         }
      }

      //when someone searches for a new location, it places a marker with listeners on it
      function addListeners(which) {
         //add a listner to each pin
         google.maps.event.addListener(which, 'places_changed', function() {
            //get the places that came from the search box
            var places = which.getPlaces();
            deleteMarkers(null);
            if (places) {
               var bounds = new google.maps.LatLngBounds();
               var marker;
               places.forEach(function(place) {
                  createMarker(place);

                  if (place.geometry.viewport) {
                     bounds.union(place.geometry.viewport);
                  } else {
                     bounds.extend(place.geometry.location);
                  }
                  map.setZoom(13);
               });
               map.fitBounds(bounds);
            }
         });
      }

      //initialize maps
      function initMap(location) {
         map = new google.maps.Map(document.getElementById('map'), {
            center: location,
            scrollwheel: true,
            zoom: 16,
            mapTypeControl: false
         });

         // Create the search box and link it to the UI element.
         $("#pac-input").remove();
         var input = document.createElement('input');

         $(input).attr({
            id: "pac-input",
            class: "controls",
            placeholder: "Search for a place to go"
         });
         map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);
         var searchBox = new google.maps.places.SearchBox(input);

         infowindow = new google.maps.InfoWindow();
         var bounds = new google.maps.LatLngBounds();
         var cityCircle = new google.maps.Circle({
            strokeOpacity: 0.0,
            fillOpacity: 0.0,
            map: map,
            center: location,
            radius: 3000
         }); // create radius around current center to refine results
         markers.push(cityCircle);
         searchBox.setBounds(bounds.union(cityCircle.getBounds()));
         deleteMarkers();
         service = new google.maps.places.PlacesService(map);
         addListeners(searchBox);
      }

      var initLoc = mapService.officeLocation[$cookies.getObject("user").officeLoc];
      if (initLoc === undefined) {
         initLoc = mapService.officeLocation.Portland;
      }
      initMap(initLoc);
   });
'use strict';

/**
 * @ngdoc service
 * @name lunchBoxApp.yelpService
 * @description
 * # yelpService
 * Service in the lunchBoxApp.
 */

const clientId = 'E7TDSHtwRDuS4-evH-rD3Q'
const clientSecret = '5cHe6aVf3Ixa3RAsYlBaBCO4VmqjW0bQCkiJlp57jFa89WCKc4SgMdRYcatKvifw'

angular.module('lunchBoxApp')
  .service('yelpService', function ($http) {
    $http({
      method: 'GET',
      url: 'https://api.yelp.com/v3/businesses/search?location=411%2BSouthwest%2B3rd%2BAvenue,%2BPortland&term=hubers',
      headers: {
        'Authorization': 'Qh457Wk44ZREhqHh_fB5aQX60-wpDyzJxJ39MCtP4sg7XXvmMaQ-gCc2doVZGd8n6bUHuT5z46JluYVoNvB9BSdwdH3gS1G9XSKoDMYJaWdeayTQhbdCzZkUsAZxWXYx',
        "Content-Type": "application/json",
        "Accept": "application/json",
      }
      // params: {
      //   term: 'hubers',
      //   location: '411 Southwest 3rd Avenue, Portland',
      // }
    }).then(function success(response) {
      console.log(response)
    });
  })

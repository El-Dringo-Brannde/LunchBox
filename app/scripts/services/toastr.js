/*global toastr*/

'use strict';

/**
 * @ngdoc service
 * @name lunchBoxApp.toastr
 * @description
 * # toastr
 * Service in the lunchBoxApp.
 */
angular.module('lunchBoxApp')
  .service('toastr', function () {
    var toastrInit = function (notification, type) {
      toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": true,
        "onclick": null,
        "showDuration": "100",
        "hideDuration": "1000",
        "timeOut": "2500",
        "extendedTimeOut": "1500",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
      };
      toastr[type](notification);
    };
    return toastrInit;
  });

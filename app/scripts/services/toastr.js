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
    var toastrInit = function () {
      toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-top-right",
        "preventDuplicates": true,
        "onclick": null,
        "showDuration": "100",
        "hideDuration": "1000",
        "timeOut": "2000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
      }
      toastr["success"]("You are already in this group!")
    }
    return toastrInit
  });

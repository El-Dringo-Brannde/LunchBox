/*global $*/

'use strict';

/**
 * @ngdoc service
 * @name lunchBoxApp.regexService
 * @description
 * # regexService
 * Service in the lunchBoxApp.
 */
angular.module('lunchBoxApp')
   .service('regexService', function() {
      var regexTest = function(reg, val, tag) {
         var errorColor = "red";
         if (reg.test(val)) {
            //leave the text be whatever color it is normally
            $(tag).css("color", "");
            return true;
         } else {
            $(tag).css("color", errorColor);
            return false;
         }
      };
      $("#timeInput").on("focusout", function() {
         var userValue = $("#timeInput").val();

         //match either one or two numbers, then a :, then two numbers
         var timeRule = new RegExp("^[0-9]{1,2}:[0-9]{2}$");

         if (regexTest(timeRule, userValue, "#timeInput") || userValue === "") {
            $("#error").html("");
         } else {
            $("#error").html("the departure time is not in the proper format (eg. 12:00)");
         }

      });

      $(".textBox").focus(function() {
         /*
         - Grab the id of the text box, identify the label for that associated id, and add in the attribute
         is-active and is-completed.
         - is-active moves the label up and makes it blue.
         - is-completed keeps the label there and makes it grey.
         */
         $("label[for='" + $(this).attr("id") + "']").addClass("is-active is-completed");
      });

      $(".textBox").focusout(function() {
         //if the value of the box is empty
         if ($(this).val() === "") {
            //grab the id of the selected box, target the associated label and remove the is-completed class
            $("label[for='" + $(this).attr("id") + "']").removeClass("is-completed");
         }
         //remove the is active class
         $("label[for='" + $(this).attr("id") + "']").removeClass("is-active");
      });
   });
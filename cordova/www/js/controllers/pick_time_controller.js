'use strict';

angular.module('teaApp')
  .controller('PickTimeController', function($scope, $window, Storage, RouteApi){
    $scope.times = [];

    var convert2british = function (hr, min) {
        var p = "am", h = hr;

        if (hr > 12) {
            h = hr - 12;
            p = "pm";
        } else if (h < 1) {
            h = 12;
        }

        if (min == 0) {
            min = "00";
        }

        return h+":"+min+" "+p;
    }

    for (var i = 0; i < 24; i++) {
        for (var j = 0; j < 4; j++) {
           $scope.times.push(convert2british(i,j*15));
        }
    }

    $scope.submit = function () {
        if($scope.go && $scope.selectedTime){
            Storage.setRoute('selectedTime', $scope.selectedTime);
            Storage.setRoute('go', $scope.go);

  //          console.log(Storage.getRoute('time'));
  //          console.log(Storage.getRoute('go'));
            $window.location.href = '#/select-pickup';
        }
        else{
            alert("Please make a selection before continuing");
        }
    }

  });

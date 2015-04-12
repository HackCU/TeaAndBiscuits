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

        if (min < 10) {
            min = "0" + min.toString();
        }

        return h+":"+min+" "+p;
    }

    var date = new Date();
    var tempDate = angular.copy(date);

    for (var i = 0; i < 24; i++) {
        tempDate.setHours(i);
        for (var j = 0; j < 59; j++) {
            tempDate.setMinutes(j);
            if (tempDate >= date)
                $scope.times.push(convert2british(i,j));
        }
    }

    $scope.submit = function () {
        if($scope.selectedTime){
            Storage.setRoute('selectedTime', $scope.selectedTime);
           // Storage.setRoute('go', $scope.go);

  //          console.log(Storage.getRoute('time'));
  //          console.log(Storage.getRoute('go'));
            $window.location.href = '#/select-pickup';
        }
        else{
            alert("Please make a selection before continuing");
        }
    }

  });

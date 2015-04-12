'use strict';

angular.module('teaApp')
  .controller('NextBusController', function($scope, $window, $timeout, Storage, RouteApi){

    var route = Storage.getRoute('route');
    var direction = Storage.getRoute('direction');
    var time = Storage.getRoute('selectedTime');
    var pickup = Storage.getRoute('pickup');


    // Ajax Success/ Errors
    var onSuccess = function(p) {
        $scope.now = p.timestamp;
    };

    var onError = function(err) {
        console.log('code '+err.code+'\n'+'message: '+err.message+'\n');
    };

    //Geolocation Get
    navigator.geolocation.getCurrentPosition(onSuccess, onError,{timeout:5000,enableHighAccuracy:true});

    $scope.timePromise = RouteApi.fetch('stop/'+route+'/'+pickup+'/'+direction + '/' + time, {}).get();
    $scope.timet = {};
    $scope.timePromise.$promise.then(function(){
      $scope.timet.hours = $scope.timePromise.hours;
      $scope.timet.minutes = $scope.timePromise.minutes;
      calculateTimeToArrival($scope.timet);
    });

    var format = function(time){
      if (time < 10){
        return "0" + time;
      }
      return time;
    }

    var calculateTimeToArrival = function(timeObj){
      var date = new Date;
      var minutes = date.getMinutes();
      var hour = date.getHours();
      var nextMinutes = timeObj.minutes;
      var nextHours = timeObj.hours;

      var outputMin = nextMinutes - minutes;
      var outputHour = nextHours - hour;
      if (outputMin < 0){
        outputMin = outputMin + 60;
        outputHour--;
      }
      if (outputHour < 0){
        outputHour += 24;
      }

      $scope.mins = format(outputMin);
      $scope.hours = format(outputHour);
    }




    //Start logic for timer



    $scope.seconds = "0" + 1;

    $scope.onTimeout = function(){
        $scope.seconds--;
        if ($scope.seconds < 10){
          $scope.seconds = "0" + $scope.seconds;
        }
        if ($scope.hours + $scope.mins + $scope.seconds == 0){
          $scope.timerDone = true;
          return;
        }


        if ($scope.seconds == 0 && $scope.mins > 0 ){
          $scope.mins--;
          $scope.seconds = 59;
          if ($scope.mins < 10){
            $scope.mins = "0" + $scope.mins;
          }
          if (!(typeof cordova === 'undefined') && $scope.hours == 0){
            cordova.plugins.pebble.alert("sender","TEA - 1 min","Your bus should be arriving soon!", null, null);
          }
        }
        else if ($scope.seconds == 0 && $scope.mins == 0 && $scope.hours > 0){
          $scope.hours--;
          $scope.mins = 59;
          $scope.seconds = 59;
        }
        mytimeout = $timeout($scope.onTimeout,1000);
    }

    var updateTime = function(){
      calculateTimeToArrival($scope.timet);
      mytimeout = $timeout(updateTime,30000);
    }

    $scope.submit = function() {
        alert("Excellent! Enjoy your ride, we'll let everyone know the bus is coming!")
        $window.location.href = '#/';
    };

    // $scope.pullUpdate = function() {
    //      if ($scope.route && $scope.direction && ($scope.pickup || $scope.destination)) {
    //         return RouteApi.fetch('update/stop/'+$scope.route+'/'+direction,{}).query();
    //     }
    // }
    $scope.addTimeToCounter = function() {
        $scope.seconds = "01";
        $scope.mins = "0" + 2;
        $scope.hours = "0";
        alert('Added two more minutes to the timer. Be patient!');
        $scope.onTimeout();
    }

    var mytimeout = $timeout($scope.onTimeout,1000);
  });

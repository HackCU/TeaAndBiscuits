'use strict';

angular.module('teaApp')
  .controller('NextBusController', function($scope, $window, $timeout, Storage){

    var onSuccess = function(p) {
        alert(p.timestamp);
        $scope.now = p.timestamp;
    };

    var onError = function(err) {
        console.log('code '+err.code+'\n'+'message: '+err.message+'\n');
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError,{timeout:5000,enableHighAccuracy:true});

    $scope.seconds = "0" + 4;
    $scope.mins = "0" + 0;
    $scope.hours = 0;

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
    var mytimeout = $timeout($scope.onTimeout,1000);

    $scope.submit = function() {
        alert("Excellent! Enjoy your ride, we'll let everyone know the bus is coming!")
        $window.location.href = '#/';
    };

    $scope.pullUpdate = function() {
         if ($scope.route && $scope.direction && ($scope.pickup || $scope.destination)) {
            return RouteApi.fetch('update/stop/'+$scope.route+'/'+direction,{}).query();
        }
    }
    $scope.addTimeToCounter = function() {
        $scope.seconds = "01";
        $scope.mins = "0" + 2;
        $scope.hours = "0";
        alert('Added two more minutes to the timer. Be patient!');
        $scope.onTimeout();
    }

  });

'use strict';

angular.module('teaApp')
  .controller('NextBusController', function($scope, $window, $timeout){
    var onSuccess = function(p) {
        return p.timestamp;
    };

    var onError = function(err) {
        console.log('code '+err.code+'\n'+'message: '+err.message+'\n');
    };

    $scope.currentTimestamp = navigator.geolocation.getCurrentPosition(onSuccess, onError);
    $scope.seconds = "0" + 4;
    $scope.mins = "0" + 1;
    $scope.hours = 21;

    $scope.onTimeout = function(){
        $scope.seconds--;
        if ($scope.seconds < 10){
          $scope.seconds = "0" + $scope.seconds
        }
        if ($scope.hours + $scope.mins + $scope.seconds == 0){
          return;
        }
        if ($scope.seconds == 0 && $scope.mins > 0 ){
          $scope.mins--;
          $scope.seconds = 59;
          if ($scope.mins < 10){
          $scope.mins = "0" + $scope.mins
        }
          if (!(typeof cordova === 'undefined')){
            console.log("yo");
            cordova.plugins.pebble.alert("sender","title","body", null, null);
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
        $window.location.href = '#/bus-arrive';
    };

    $scope.pushUpdate = function() {
        var update = RouteApi.save();

        return update;
    };


    $scope.pullUpdate = function() {
         if ($scope.route && $scope.direction && ($scope.pickup || $scope.destination)) {
            return RouteApi.fetch('update/stop/'+$scope.route+'/'+direction,{}).query();
        }
    }

  });

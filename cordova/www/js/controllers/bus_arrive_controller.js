'use strict';

angular.module('teaApp')
  .controller('BusArriveController', function($scope, $window){
    var onSuccess = function(pos) {
        $scope.now = p.timestamp;
    };

    var onError = function(err) {
        console.log('code '+err.code+'\n'+'message: '+err.message+'\n');
    };

    $scope.wait = function () {
        var update = {};
        navigator.geolocation.getCurrentPosition(onSuccess, onError,{timeout:5000,enableHighAccuracy:true});

        if ($scope.now) {
            update = RouteApi.fetch('stop/'$scope.route+'/'+$scope.direction+'/'+$scope.pickup+'/'+$scope.now).query();
            //posting
        }

        $window.location.href = '#/next-bus';
    };
    $scope.here = function () {
        navigator.geolocation.getCurrentPosition(onSuccess, onError,{timeout:5000,enableHighAccuracy:true});

        if ($scope.now) {
            update = RouteApi.fetch('stop/'$scope.route+'/'+$scope.direction+'/'+$scope.pickup+'/'+$scope.now).query();
            //posting
        }
    };
    $scope.leave = function () {
        alert("Thanks for choosing to enjoy your tea and biscuits!");
        navigator.geolocation.getCurrentPosition(onSuccess, onError,{timeout:5000,enableHighAccuracy:true});

        if ($scope.now) {
            update = RouteApi.fetch('stop/'$scope.route+'/'+$scope.direction+'/'+$scope.pickup+'/'+$scope.now).query();
            //posting
        }
    };
  });

'use strict';

angular.module('teaApp')
  .controller('BusArriveController', function($scope, $window, RouteApi, Storage){
    $scope.route = Storage.getRoute('route');
    $scope.direction = Storage.getRoute('direction');
    $scope.pickup = Storage.getRoute('pickup');
    $scope.now = -1;

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
            update = RouteApi.fetch('stop/'+$scope.route+'/'+$scope.direction+'/'+$scope.pickup+'/wait/'+$scope.now).save();
            //posting
        }
         Storage.setRoute('wait', true);
        $window.location.href = '#/next-bus';
    };
    $scope.here = function () {
        //navigator.geolocation.getCurrentPosition(onSuccess, onError,{timeout:5000,enableHighAccuracy:true});
        var update = {};
        if ($scope.now) {
            update = RouteApi.fetch('stop/'+$scope.route+'/'+$scope.direction+'/'+$scope.pickup+'/here/'+$scope.now).save();
            //posting
        }
    };
  });

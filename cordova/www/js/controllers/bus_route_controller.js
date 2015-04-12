'use strict';

angular.module('teaApp')
  .controller('BusRouteController', function($scope, $window, Storage, RouteApi){
    $scope.routes = RouteApi.fetch('route', {}).query();

    $scope.submit = function() {
      if ($scope.myRoute && $scope.myDirection){
        var dir = $scope.myRoute.directions.indexOf($scope.myDirection);
        Storage.setRoute('route', $scope.myRoute.name);
        Storage.setRoute('direction', dir);
        $window.location.href = '#/pick-time';
      }
      else{
        alert("Please make a selection before continuing");
      }
    }
  });

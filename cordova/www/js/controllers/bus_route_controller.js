'use strict';

angular.module('teaApp')
  .controller('BusRouteController', function($scope, $window, Storage, RouteApi){
    $scope.routes = RouteApi.fetch('route', {}).query();

    $scope.submit = function() {
      Storage.setRoute('test', 'testval');
      console.log(Storage.getRoute('test'));
      $window.location.href = '#/pick-time';
    }
  });

'use strict';

angular.module('teaApp')
  .controller('BusRouteController', function($scope, $window, Storage){
    $scope.test = "test";

    $scope.submit = function() {
      Storage.setRoute('test', 'testval');
      console.log(Storage.getRoute('test'));
      $window.location.href = '#/pick-time';
    }
  });

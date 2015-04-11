'use strict';

angular.module('teaApp')
  .controller('BusArriveController', function($scope, $window){
    $scope.test = [
      'test list 1',
      'test list 2'
    ];
    $scope.wait = function () {
        $window.location.href = '#/next-bus';
    };
    $scope.here = function () {
        alert("Your bus is here!");
    };
    $scope.leave = function () {
        alert("42!");
    };
  });

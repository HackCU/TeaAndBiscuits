'use strict';

angular.module('teaApp')
  .controller('NextBusController', function($scope, $window){
    $scope.test = [
      'test list 1',
      'test list 2'
    ];

    $scope.submit = function() {
        $window.location.href = '#/bus-arrive';
    }
  });

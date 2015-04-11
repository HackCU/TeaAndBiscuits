'use strict';

angular.module('teaApp')
  .controller('NextBusController', function($scope){
    $scope.test = [
      'test list 1',
      'test list 2'
    ];

    $scope.submit = function() {
        alert("the next bus is coming in 2 minutes.");

    }
  });

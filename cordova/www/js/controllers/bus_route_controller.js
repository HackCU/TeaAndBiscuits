'use strict';

angular.module('teaApp')
  .controller('BusRouteController', function($scope){
    $scope.test = "test";

    $scope.submit = function() {
          alert("yo");
    }
  });

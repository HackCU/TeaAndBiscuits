'use strict';

angular.module('teaApp')
  .controller('BusRouteController', function($scope){
    $scope.test = [
      'test list 1',
      'test list 2'
    ],
    $scope.submit = function () {
        //submit choices to db

        //route to next view

    }
  });

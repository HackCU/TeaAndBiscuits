'use strict';

angular.module('teaApp')
  .controller('NextBusController', function($scope, $window, RouteApi, Storage){
    $scope.test = [
      'test list 1',
      'test list 2'
    ];

    $scope.submit = function() {
        $window.location.href = '#/bus-arrive';
    };

    $scope.pushUpdate = function() {
        var update = RouteApi.save();

        return update;
    };


    $scope.pullUpdate = function() {
         if ($scope.route && $scope.direction && ($scope.pickup || $scope.destination)) {
            return RouteApi.fetch('update/stop/'+$scope.route+'/'+direction,{}).query();
        }
    }

  });

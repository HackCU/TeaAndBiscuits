'use strict';

angular.module('teaApp')
  .controller('SelectDestinationController', function($scope, $window, Storage, RouteApi){
    var route = Storage.getRoute('route');
    var direction = Storage.getRoute('direction');
    var pickup = Storage.getRoute('pickup');
    var time = Storage.getRoute('selectedTime');
    var go = Storage.getRoute('go');

    $scope.destinationStops = RouteApi.fetch('stop/'+route+'/'+direction, {}).query();
    var current = '';

    $scope.destinationStops.$promise.then( function(){
      while(current.stop_id != pickup){
        current = $scope.destinationStops.shift();
      }
    });

    $scope.selectDestination = function(id) {
        Storage.setRoute('destination', id);
        var timed = RouteApi.fetch('stop/'+route+'/'+go+'/'+pickup+'/'+$scope.destination+'/'+direction+'/'+time).query();
        if (timed) {
            alert("Your route is set!");
            $window.location.href = '#/next-bus';
        }
    }
  });

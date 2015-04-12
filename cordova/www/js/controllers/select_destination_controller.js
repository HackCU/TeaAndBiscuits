'use strict';

angular.module('teaApp')
  .controller('SelectDestinationController', function($scope, Storage, RouteApi){
    var route = Storage.getRoute('route');
    var direction = Storage.getRoute('direction');
    var pickup = Storage.getRoute('pickup');

    $scope.destinationStops = RouteApi.fetch('stop/'+route+'/'+direction, {}).query();
    $scope.current = '';

    console.log($scope.destinationStops);


    $scope.selectDestination = function() {
        Storage.setRoute('test', 'testval');
        alert("Your route is set!");
    }
  });

'use strict';

angular.module('teaApp')
  .controller('SelectPickupController', function($scope, $window, RouteApi, Storage){
    var route = Storage.getRoute('route');
    var direction = Storage.getRoute('direction');

    $scope.pickupStops = RouteApi.fetch('stop/'+route+'/'+direction, {}).query();

    $scope.choosePickup = function(id){
      Storage.setRoute('pickup', id);
      $window.location.href = '#/select-destination';
    }
  });

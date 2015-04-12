'use strict';

angular.module('teaApp')
  .controller('SelectPickupController', function($scope, $window, RouteApi, Storage){
    var route = Storage.getRoute('route');
    var direction = Storage.getRoute('direction');
    var time = Storage.getRoute('selectedTime');

    $scope.pickupStops = RouteApi.fetch('stop/'+route+'/'+direction, {}).query();

    $scope.choosePickup = function(id, name){
      Storage.setRoute('pickup', name);
      var timed = RouteApi.fetch('stop/'+route+'/'+id+'/'+direction+'/'+time).query();

      if (timed) {
        alert('Your route is set!');
        $window.location.href = '#/next-bus';
      }
    }
  });

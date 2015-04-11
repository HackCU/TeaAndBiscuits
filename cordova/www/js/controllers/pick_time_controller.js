'use strict';

angular.module('teaApp')
  .controller('PickTimeController', function($scope, $window, Storage){
    $scope.test = [
      'test list 1',
      'test list 2'
    ];

    $scope.submit = function () {
        Storage.setRoute('test', 'testval');
        console.log(Storage.getRoute('test'));
        $window.location.href = '#/select-pickup';
    }

  });

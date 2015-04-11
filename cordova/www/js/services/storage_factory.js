'use strict';

angular.module('teaApp')
  .factory('Storage', function($window) {
    var localStore = $window.localStorage;

    var getRoute =  function(key) {
      return localStore.getItem(key);
    }

    var setRoute = function (key, value){
      localStore.setItem(key, value);
    }

    var removeRoute = function(key){
      localStore.removeItem(key);
    }

    return { getRoute: getRoute, setRoute: setRoute, removeRoute: removeRoute};
  });

'use strict';

angular.module('teaApp')
  .factory('RouteApi', function ($resource){
      var API_BASE = "https://teaandbiscuits.herokuapp.com/api/";
      var fetch = function(route, vars){
        return $resource(API_BASE + route, vars);
      }
      return {fetch:fetch};
    });

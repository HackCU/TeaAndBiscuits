'use strict';

/**
  * @ngdoc overview
  * @name Tea And Biscuits
  * @description
  * # Transit App
  *
  * Transit application for predicting routes
  */

angular.module('teaApp',[
  'ngRoute'
  ])

  .config( function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainController'
      })
      .when('/bus-route',{
        templateUrl: 'views/bus-route.html',
        controller: 'BusRouteController'
      })
      .when('/pick-time', {
          templateUrl: 'views/pick-time.html'
        })
      .otherwise({
        redirectTo: '/'
      });
  });

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
  'ngRoute',
  'ngTouch',
  'ngResource'
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
          templateUrl: 'views/pick-time.html',
          controller: 'PickTimeController'
        })
      .when('/select-pickup',{
        templateUrl: 'views/select-pickup.html',
        controller: 'SelectPickupController'
      })
      .when('/select-destination',{
        templateUrl: 'views/select-destination.html',
        controller: 'SelectDestinationController'
      })
      .when('/view-alerts',{
        templateUrl: 'views/view-alerts.html'
      })
      .when('/bus-arrive', {
        templateUrl: 'views/bus-arrive.html',
        controller: 'BusArriveController'
      })
      .when('/next-bus', {
        templateUrl: 'views/next-bus.html',
        controller: 'NextBusController'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

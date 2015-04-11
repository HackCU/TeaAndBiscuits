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
      .when('/choose-route',{
        templateUrl: 'views/routes.html'
      })
      .when('/select-pickup',{
        templateUrl: 'views/select-pickup.html'
      })
      .when('/select-destination',{
        templateUrl: 'views/select-destination.html'
      })
      .when('/view-alerts',{
        templateUrl: 'views/view-alerts.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

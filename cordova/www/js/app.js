'use strict';

/**
  * @ngdoc overview
  * @name Tea And Biscuits
  * @description
  * # Transit App
  *
  * Transit application for predicting routes
  */

angular.module('tea',[
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
      .otherwise({
        redirectTo: '/'
      });
  });

'use strict';

angular.module('teaApp')
  .controller('NextBusController', function($scope, $window, $timeout, $location, Storage, RouteApi){

    var route = Storage.getRoute('route');
    var direction = Storage.getRoute('direction');
    var time = Storage.getRoute('selectedTime');
    var pickup = Storage.getRoute('pickup');
    $scope.counter = 0;

    var isNextBus = function(){
      return ($location.path() == '/next-bus');
    }

    // Ajax Success/ Errors
    var onSuccess = function(p) {
        $scope.now = p.timestamp;
    };

    var onError = function(err) {
        console.log('code '+err.code+'\n'+'message: '+err.message+'\n');
    };

    //Geolocation Get
    navigator.geolocation.getCurrentPosition(onSuccess, onError,{timeout:5000,enableHighAccuracy:true});

    $scope.timePromise = RouteApi.fetch('stop/'+route+'/'+pickup+'/'+direction + '/' + time, {}).get();
    $scope.timet = {};
    $scope.timePromise.$promise.then(function(){
      $scope.timet.hours = $scope.timePromise.hours;
      $scope.timet.minutes = $scope.timePromise.minutes;
      $scope.tripId = $scope.timePromise.tripId;
      $scope.stopId = $scope.timePromise.stopId;
      calculateTimeToArrival($scope.timet);
      $scope.currentTime = {
          'hours': $scope.timet.hours ,
          'minutes': $scope.timet.minutes
      }
      $timeout($scope.onTimeout,1000);
    });

    var format = function(time){
      if (time < 10){
        return "0" + time;
      }
      return time;
    }

    var calculateTimeToArrival = function(timeObj){
      var date = new Date;
      var minutes = date.getMinutes();
      var hour = date.getHours();
      var nextMinutes = timeObj.minutes;
      var nextHours = timeObj.hours;

      var outputMin = nextMinutes - minutes;
      var outputHour = nextHours - hour;
      if (outputMin < 0){
        outputMin = outputMin + 60;
        outputHour--;
      }
      if (outputHour < 0){
        outputHour += 24;
      }

      $scope.mins = format(outputMin);
      $scope.hours = format(outputHour);
    }

    //Start logic for timer

    $scope.seconds = "0" + 1;

    $scope.onTimeout = function(){
        $scope.counter++;
        if (!($scope.counter % 10) && ($scope.counter % 60)){
          updateTime();
        }
        $scope.seconds--;
        if ($scope.seconds < 10){
          $scope.seconds = "0" + $scope.seconds;
        }
        if ($scope.hours + $scope.mins + $scope.seconds == 0){
          $scope.timerDone = true;
          return;
        }

        if ($scope.seconds == 0 && $scope.mins > 0 ){
          if ($scope.mins == 1) {
            if (!(typeof cordova === 'undefined')){
              cordova.plugins.pebble.alert("sender","TEA - Route Update", "The bus is one minute away!", null, null);
            }
          }
          $scope.mins--;
          $scope.seconds = 59;
          if ($scope.mins < 10){
            $scope.mins = "0" + $scope.mins;
          }

        }
        else if ($scope.seconds == 0 && $scope.mins == 0 && $scope.hours > 0){
          $scope.hours--;
          $scope.mins = 59;
          $scope.seconds = 59;
        }
        if (isNextBus()){
          $timeout($scope.onTimeout,1000);
        }
    }

    var updateTime = function(){
      // api call to get new time
      var newTime = RouteApi.fetch('time/'+$scope.tripId+'/'+$scope.stopId).get();
      // check time agains $scope.currentTime
      var timeChanged = false;
      newTime.$promise.then(function(){

        console.log("new time = "+ newTime.hours + ":" + newTime.minutes);
        console.log("current time = "+ $scope.currentTime.hours + ":" + $scope.currentTime.minutes);

        if (newTime.hours != $scope.currentTime.hours){
          timeChanged = true;
        }
        else if (newTime.minutes != $scope.currentTime.minutes){
          mindiff = Math.abs($scope.currentTime.minutes - newTime.minutes);
          if (mindiff > 1  && mindiff != 59){
            timeChanged = true;
          }
        }
        if (timeChanged){
          console.log('time changed!')
          var message = '';
          if (isLate($scope.currentTime, newTime)){
            message = "The bus is late. The current arrival time is now " + convert2british(newTime.hours, newTime.minutes);
          }
          else{
            message = "The bus is early. The current arrival time is now " + convert2british(newTime.hours, newTime.minutes);
          }
          $scope.currentTime = newTime;
          if (!(typeof cordova === 'undefined')){
              cordova.plugins.pebble.alert("sender","TEA - Route Update", message, null, null);
          }
          calculateTimeToArrival($scope.currentTime);
          alert(message);

        }
      });

    }

    var isLate = function(oldTime, newTime){
      var hoursdiff = oldTime.hours - newTime.hours;
      if (hoursdiff < 0){
        return false;
      }
      else if (hoursdiff > 0){
        return true;
      }
      else{
        var mindiff = oldTime.minutes - newTime.minutes;
        if (mindiff < 0){
          return false;
        }
        else{
          return true;
        }
      }
    }

    $scope.addTimeToCounter = function() {
        $scope.seconds = "01";
        $scope.mins = "0" + 2;
        $scope.hours = "0";
        $scope.timerDone = false;
        alert('Added two more minutes to the timer. Be patient!');
        $scope.onTimeout();
    }

    $scope.here = function () {
        var date = new Date;
        var minutes = date.getMinutes();
        var hours = date.getHours();
        //navigator.geolocation.getCurrentPosition(onSuccess, onError,{timeout:5000,enableHighAccuracy:true});
        ///time/:tripid/:stopid/:hours/:minutes
        var update = {};
        console.log("sent time = "+ hours + ":" + minutes);
        update = RouteApi.fetch('time/'+$scope.tripId+'/'+$scope.stopId+'/'+hours+'/'+minutes).get();
        alert("Excellent! Enjoy your ride, we'll let everyone know the bus is coming!")
        $window.location.href = '#/';
    }

    var convert2british = function (hr, min) {
        var p = "am", h = hr;

        if (hr > 12) {
            h = hr - 12;
            p = "pm";
        } else if (h < 1) {
            h = 12;
        }

        if (min < 10) {
            min = "0" + min.toString();
        }

        return h+":"+min+" "+p;
    }


  });

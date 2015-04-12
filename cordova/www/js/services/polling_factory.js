'use strict';

angular.module('teaApp')
.factory('Polling', function($http, $timeout) {
    var data = { response: {}, updates: 0 };
    var poller = function() {
        $http.get('update.json').then(function(r) {
            data.response = r.data;
            data.updates++;
            $timeout(poller, 1000);
        });
    };

    poller();

    return data.response;
});

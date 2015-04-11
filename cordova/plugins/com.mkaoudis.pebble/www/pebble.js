var exec = require('cordova/exec'),

    genericError = function(err){ console.error(err); },
    dummy = function(){},
	pebble = function() {
};

pebble.isWatchConnected = function(success, error){
	if (!success) return console.error('success callback is required');
	cordova.exec(success, error || genericError, 'Pebble', 'isWatchConnected', []);
};

pebble.alert = function(sender, title, body, success, error){
	if(!sender || !title || !body) return console.error('sender, title, and body are required');
	cordova.exec(success || dummy, error || genericError, 'Pebble', 'alert', [sender, title, body]);
};

module.exports = pebble;
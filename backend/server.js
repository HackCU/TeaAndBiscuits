var _ = require('lodash');

var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');

var pg = require('pg');
var conString = process.env.DATABASE_URL || 'postgres://localhost:5432/gtfs';

var activeRoutes = {};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var port = process.env.PORT || 8080;

var router = express.Router();

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

function lightRailSafety(route_name) {

  if (route_name.toLowerCase().match(/[cdefh] line/)) {
    route_name = '101' + route_name[0].toUpperCase();
  }
  else if (route_name.toLowerCase() == "w line") {
    route_name = '103W';
  }

  return route_name;

}

function getTimeString(time) {
  //time in format "02:00 am"

  var pm = time.slice(time.indexOf(" ") + 1, time.length) == "pm" ? true : false;

  var hour = parseInt(time.slice(0, time.indexOf(":"))) + (pm ? 12 : 0)
  hour = hour < 10 ? "0" + hour.toString() : hour.toString();

  var minutes = time.slice(time.indexOf(":") + 1, time.indexOf(":") + 3);

  return hour + ":" + minutes + ":00";
}

router.route('/time/:trip/:stop/:hours/:minutes')
  .get(function(req, res) {
    var tripId = req.params.trip;
    var stopId = req.params.stop;

    var departureSeconds = req.params.hours * 3600 + req.params.minutes * 60;

    var departingIndex = _.findIndex(activeRoutes[tripId], function(row) {
      return row.stop_id === stopId;
    });

    var rows = activeRoutes[tripId];

    var difference = departureSeconds - rows[departingIndex].departure_time_seconds;

    for(var i = departingIndex + 1; i < rows.length; i++) {
      var row = rows[i];
      row.arrival_time_seconds += difference;
      // if (row.arrival_time_seconds > row.departure_time_seconds) {
      //   difference = row.arrival_time_seconds - row.departure_time_seconds;
      //   row.departure_time_seconds += difference;
      // }
      //else break;
    }

    res.json("Updated!");

  });

//polling one
router.route('/time/:trip/:stop')
  .get(function(req, res) {
    var tripId = req.params.trip;
    var stopId = req.params.stop;
    var timestamp = req.params.time;

    var correctRow = _.find(activeRoutes[tripId], function(row) {
      return row.stop_id === stopId;
    })

    if (!correctRow) res.json([]);
    else {
      var seconds = correctRow.arrival_time_seconds;

      var hours = Math.floor(seconds / 3600)
      var minutes = Math.floor(60*((seconds / 3600) - hours))

      res.json({hours: hours, minutes: minutes});
    }

  })

router.route('/stop/:route/:stop/:direction/:time')
  .get(function(req, res) {

    var routeId = lightRailSafety(req.params.route);
    var stopName = req.params.stop;
    var direction = parseInt(req.params.direction);
    var time = getTimeString(req.params.time);

    var query = 'SELECT gtfs_trips.trip_id, gtfs_stop_times.arrival_time, gtfs_stop_times.stop_id ' +
    'FROM gtfs_trips ' +
    'INNER JOIN gtfs_stop_times ON gtfs_stop_times.trip_id = gtfs_trips.trip_id ' +
    'INNER JOIN gtfs_stops ON gtfs_stops.stop_id = gtfs_stop_times.stop_id ' +
    "WHERE LOWER(route_id) = LOWER('" + routeId + "') AND (service_id = 'WK' OR service_id = 'MT' OR service_id = 'FR') AND direction_id = " + direction + " AND LOWER(stop_name) = LOWER('"+ stopName + "') ORDER BY arrival_time;"

    pg.connect(conString, function(err, client) {
      if (err) throw err;
      client.query(query, function(err, result) {
        if (!result.rows || !result.rows.length) {
          res.json([]);
          return;
        }

        var rows = result.rows;
        var nextRow = _.find(rows, function(row) {
          return row.arrival_time > time;
        }) || rows[0];

        var data = nextRow.arrival_time.split(':');
        var tripId = nextRow.trip_id;

        res.json({hours: data[0], minutes: data[1], tripId: tripId, stopId: nextRow.stop_id});

        if (!activeRoutes[tripId]) {
          client.query("select departure_time_seconds, arrival_time_seconds, stop_id from gtfs_stop_times where trip_id='" + tripId + "' ORDER BY stop_sequence;", function(err, result) {
            activeRoutes[tripId] = result.rows;
            client.end();
          })
        }
        else {
          client.end();
        }
      })
    })
  })


router.route('/stop/:route/:direction')
  .get(function(req, res) {
    var route_id = lightRailSafety(req.params.route);

    var query = "SELECT stop_id, stop_name FROM gtfs_stops WHERE stop_id " +
    "IN (SELECT DISTINCT stop_id FROM gtfs_stop_times WHERE trip_id " +
    "IN ( SELECT trip_id FROM gtfs_trips WHERE LOWER(route_id) = LOWER('" + route_id + "') AND direction_id=" + req.params.direction.toString() +
    "));"

    pg.connect(conString, function(err, client) {
      client.query(query, function(err, result) {
        client.end();
        res.json(result ? result.rows : []);
      })
    })
  })

router.route('/route')
  .get(function(req, res) {
    pg.connect(conString, function(err, client) {
      if (err) throw err;
      client.query('SELECT route_short_name, route_desc FROM gtfs_routes ', function(err, result) {
        if (err) throw err;
        client.end();

        res.json(_.map(result.rows, function(route) {
          var directions = _.trimLeft(route['route_desc'], 'This Route Travels ').split(' & ');
          return {'name': route['route_short_name'], 'directions': directions}
        }));

      })
    });
  })

app.use('/api', router);

app.listen(port);
console.log('Listening on port:', port);

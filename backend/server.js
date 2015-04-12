var _ = require('lodash');

var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');

var pg = require('pg');
var conString = process.env.DATABASE_URL || 'postgres://localhost:5432/gtfs';

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

function getTimeString(time) {
  //time in format "2:00 am"

  var pm = time.slice(time.indexOf(" ") + 1, time.length) == "pm" ? true : false;
  var hour = (parseInt(time.slice(0, time.indexOf(":"))) + (pm ? 12 : 0)).toString();
  var minutes = time.slice(time.indexOf(":") + 1, time.indexOf(":") + 3);

  return hour + ":" + minutes + ":00";
}

router.route('/stop/:route/:stop/:direction/:time')
  .get(function(req, res) {

    var routeId = req.params.route;
    var stopName = req.params.stop;
    var direction = parseInt(req.params.direction);
    var time = getTimeString(req.params.time);

    var query = 'SELECT gtfs_trips.trip_id, gtfs_stop_times.departure_time ' +
    'FROM gtfs_trips ' +
    'INNER JOIN gtfs_stop_times ON gtfs_stop_times.trip_id = gtfs_trips.trip_id ' +
    'INNER JOIN gtfs_stops ON gtfs_stops.stop_id = gtfs_stop_times.stop_id ' +
    "WHERE LOWER(route_id) = LOWER('" + routeId + "') AND service_id = 'WK' AND direction_id = " + direction + " AND LOWER(stop_name) = LOWER('"+ stopName + "') ORDER BY departure_time;"

    pg.connect(conString, function(err, client) {
      if (err) throw err;
      client.query(query, function(err, result) {
        client.end();
        if (!result.rows) res.json([]);

        var rows = result.rows;
        var nextRow = _.find(rows, function(row) {
          return row.departure_time > time;
        }) || rows[0];

        var data = nextRow.departure_time.split(':');

        res.json({hours: data[0], minutes: data[1]});

      })
    })
  })


router.route('/stop/:route/:direction')
  .get(function(req, res) {
    var route_id = req.params.route;

    if (route_id.toLowerCase().match(/[cdefh] line/)) {
      route_id = '101' + route_id[0].toUpperCase();
    }
    else if (route_id.toLowerCase() == "w line") {
      route_id = '103W';
    }

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

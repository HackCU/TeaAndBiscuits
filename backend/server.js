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

router.route('update/stop/:route/:direction')
    .get(function(req, res){
        var route_id = req.params.route;
        var query = ;
    });

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

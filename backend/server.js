var express    = require('express');        
var app        = express();                 
var bodyParser = require('body-parser');

var mongoose   = require('mongoose');
var Schema = mongoose.Schema;
var mongoURI = process.env.COMPOSE_URI || "mongodb://localhost:27017/gtfsTest"
mongoose.connect(mongoURI);

var Stop = require('./app/models/stop');
Stop.findOne({}, function(err, stop) {
  if (err) {
    console.log(err);
    throw err;
  }
  console.log(stop);
})

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

router.route('/stop')
  .get(function(req, res) {
    Stop.find(function(err, stops) {
      if (err)
          res.send(err);

      res.json(stops);
    });
  });


app.use('/api', router);

app.listen(port);
console.log('Listening on port:', port);
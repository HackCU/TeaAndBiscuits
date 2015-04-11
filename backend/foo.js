var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var parse = require('csv-parse');

var count = 0;
var id = 'calendar_dates';
var collectionName = 'calendar';

var matchFromArray = function (record, id){
  matchObject = {}
  matchObject[id]=record[id]
  return matchObject;
}

var fileMap = [
  {'fName':'agency.txt','cName':'agency','uID':['agency_name']},
  {'fName':'calendar.txt','cName':'calendar','uID':['service_id']},
  {'fName':'calendar_dates.txt','cName':'calendar_dates','uID':['service_id']},
  {'fName':'stops.txt','cName':'stops','uID':['stop_id']},
  {'fName':'routes.txt','cName':'routes','uID':['route_id']},
  {'fName':'trips.txt','cName':'trips','uID':['trip_id']},
  {'fName':'stop_times.txt','cName':'stop_times','uID':['trip_id']},
  {'fName':'fare_attributes.txt','cName':'fare_attributes','uID':['fare_id']},
  {'fName':'fare_rules.txt','cName':'fare_rules','uID':['fare_id']},
  {'fName':'shapes.txt','cName':'shapes','uID':['shape_id','shape_pt_sequence']},
  {'fName':'frequencies.txt','cName':'frequencies','uID':['trip_id']},
  {'fName':'transfers.txt','cName':'transfers','uID':['from_stop_id']},
  {'fName':'feed_info.txt','cName':'feed_info','uID':['feed_publisher_name']}
]


function main() {
  for (var i = 0; i < fileMap.length; i++) {
    var filename = './rtdGTFS/'+fileMap[i]["fName"]
    if (fs.existsSync(filename)) {
      count++;
      process(fileMap[i].cName, fileMap[i].uID, filename);
    }
  }
}

function process(collectionName, id, filename) {
  var filestream = fs.createReadStream(filename);

  MongoClient.connect('mongodb://localhost:27017/gtfs', function(err, db) {
    if (err) {
      throw err;
    }

    var collection = db.collection(collectionName);
    var parser = parse({columns: true});

    parser.on('data', function(record) {
      parser.pause();
      match = matchFromArray(record, id);

      collection.update(match,record,{upsert:true}, function (err,record) {

        if (err) {
          console.log(err);
          throw err;
        }

        if(!count){
          console.log('Done');
          db.close();
          return;
        }

      });
      parser.resume();
    });

    parser.on('end', function() {
      count--;
    })
    filestream.pipe(parser);

  });
}

main();
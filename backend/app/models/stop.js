var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var StopSchema   = new Schema({
    _id: String,
    stop_id: String,
    stop_name: String,
    stop_desc: String,
    stop_lat: Number,
    stop_lon: Number,
    zone_id: String,
    stop_url: String,
    location_type: Number
});

module.exports = mongoose.model('Stop', StopSchema);
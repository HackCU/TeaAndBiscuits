var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var StopSchema   = new Schema({
    any: {}
});

module.exports = mongoose.model('Stop', StopSchema);
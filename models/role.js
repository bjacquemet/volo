var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Role = new Schema({
    name: String
});

module.exports = mongoose.model('Role', Role);
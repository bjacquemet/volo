var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Role = new Schema({
    name: String
});
// todo: add a created_by = volunteer._id

module.exports = mongoose.model('Role', Role);
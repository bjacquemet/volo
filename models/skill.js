var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Skill = new Schema({
    name: String
});


module.exports = mongoose.model('Skill', Skill);
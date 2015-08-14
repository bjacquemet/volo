var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Volunteer = new Schema({
    account_id: {type: Schema.Types.ObjectId, ref: 'Account'},
    first_name: {type: String},
    last_name: {type: String},
    email: {type: String, unique: true},
    gender: String
});


module.exports = mongoose.model('Volunteer', Volunteer);
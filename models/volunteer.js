var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Volunteer = new Schema({
    account_id: {type: Schema.Types.ObjectId, ref: 'Account'},
    first_name: String,
    last_name: String,
    email: {type: String, unique: true},
    uni_email: String,
    gender: String,
    phone: String,
    home_address: String, 
    position: String, 
    university: String,
    company: String,
    discipline: String,
    graduate: String,
    graduation_year: { type: Number, min: 2000, max: 2050 } 
});


module.exports = mongoose.model('Volunteer', Volunteer);
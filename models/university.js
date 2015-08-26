var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var University = new Schema({
    // name: String,
    // logo: { data: Buffer, contentType: String, path: String },
    // header_image: { data: Buffer, contentType: String, path: String },
    // tagline: String,
    // about: String,
    // website: String,
    // address: String,
    // contact_email: String
    // contact_phone: String,
    // registered: Boolean,
    // team_member: [{type: Schema.Types.ObjectId, ref: 'Volunteer'}],
    // main: {type: Schema.Types.ObjectId, ref: 'Volunteer'}
});


module.exports = mongoose.model('University', University);

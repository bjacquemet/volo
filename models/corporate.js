var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Corporate = new Schema({
    // name: String,
    // logo: { data: Buffer, contentType: String, path: String },
    // header_image: { data: Buffer, contentType: String, path: String },
    // tagline: String,
    // job_portal: {link: String, text: String},
    // csr_initiative: {title: String, content: String},
    // about: String,
    // website: String,
    // address: String,
    // contact_email: String
    // contact_phone: String,
    // registered: Boolean,
    // team_member: [{type: Schema.Types.ObjectId, ref: 'Volunteer'}],
    // main: {type: Schema.Types.ObjectId, ref: 'Volunteer'}
});


module.exports = mongoose.model('Corporate', Corporate);

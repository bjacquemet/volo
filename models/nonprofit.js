var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Nonprofit = new Schema({
    name: {type: String, unique: true},
    logo: {
        contentType: {type: String, default: 'image/png'},
        path: {type: String, default: '/images/nonprofit_placeholder.png'},
        name: {type: String, default: 'nonprofit_placeholder.png'}
    },
    url: String,
    // logo: { data: Buffer, contentType: String, path: String },
    // header_image: { data: Buffer, contentType: String, path: String },
    // tagline: String,
    // about: String,
    // website: String,
    // address: String,
    // contact_email: String
    // contact_phone: String,
    // tax_id: String,
    // registered: Boolean,
    // team_member: [{type: Schema.Types.ObjectId, ref: 'Volunteer'}],
    // main: {type: Schema.Types.ObjectId, ref: 'Volunteer'},
    created_by: {type: Schema.Types.ObjectId, ref: "Volunteer", required: true},
    suggested_by_volunteer: Boolean,
    updated_at: Date,
    created_at: {type: Date, default: Date.now()}
});

Nonprofit.pre('update', function (next) {
    console.log('------------->>>>>> update updated_at');
    this.update({}, {$set: {updated_at: new Date()}});
    next();
});
Nonprofit.pre('findOneAndUpdate', function (next) {
    console.log('------------->>>>>> findandupdate updated_at');
    this.update({}, {$set: {updated_at: new Date()}});
    next();
});

module.exports = mongoose.model('Nonprofit', Nonprofit);

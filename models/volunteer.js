var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosastic = require('mongoosastic')

var Volunteer = new Schema({
    account_id: {type: Schema.Types.ObjectId, ref: 'Account'},
    first_name: {type: String, es_indexed:true},
    last_name: {type: String, es_indexed:true},
    email: {type: String, unique: true},
    birthdate: Date,
    photo: { data: Buffer, contentType: String, path: String },
    uni_email: String,
    gender: String,
    phone: String,
    postcode: String,
    about: String,
    twitter: String, 
    facebook: String, 
    position: String, 
    university: String,
    discipline: String,
    graduate: String,
    graduation_year: { type: Number, min: 2000, max: 2050 },
    company: String,
    updated_at: Date,
    created_at: {type: Date, default: Date.now()}
});


Volunteer.pre('update', function(next) {
  console.log('------------->>>>>> update updated_at')
  this.update({},{ $set: { updated_at: new Date() } });
  next();
});
Volunteer.pre('findOneAndUpdate', function(next) {
  console.log('------------->>>>>> findandupdate updated_at')
  this.update({},{ $set: { updated_at: new Date() } });
  next();
});

module.exports = mongoose.model('Volunteer', Volunteer);
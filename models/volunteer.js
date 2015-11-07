var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var random = require('mongoose-random');

var Volunteer = new Schema({
    username: {type: String, required: true, unique: true},
    password: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    usertype: [String],
    last_sign_in: Date,
    first_name: {type: String},
    last_name: {type: String},
    email: {type: String, unique: true},
    birthdate: Date,
    photo: {contentType: String, originalPath: String, cropedPath: String, name: String},
    uni_email: String,
    gender: String,
    phone: String,
    country: String,
    city: String,
    about: String,
    twitter: String,
    facebook: String,
    position: String,
    university: {type: Schema.Types.ObjectId, ref: 'University'},
    area_of_study: String,
    degree: String,
    graduate: String,
    graduation_year: {type: Number, min: 2000, max: 2050},
    company: String,
    updated_at: Date,
    created_at: {type: Date, default: Date.now()}
});

Volunteer.pre('update', function (next) {
    console.log('------------->>>>>> update updated_at')
    this.update({}, {$set: {updated_at: new Date()}});
    next();
});
Volunteer.pre('findOneAndUpdate', function (next) {
    console.log('------------->>>>>> findandupdate updated_at')
    this.update({}, {$set: {updated_at: new Date()}});
    next();
});

Volunteer.plugin(passportLocalMongoose);
Volunteer.plugin(random, {path: 'r'});
Volunteer.plugin(uniqueValidator, {message: 'The {PATH} already exists. Please check your email address.'});

var VolunteerModel = mongoose.model('Volunteer', Volunteer);

VolunteerModel.syncRandom(function (err, result) {
    console.log(result.updated);
});

module.exports = VolunteerModel;
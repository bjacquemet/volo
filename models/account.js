var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var bcrypt = require('bcrypt-nodejs');
var uniqueValidator = require('mongoose-unique-validator');

var Account = new Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    usertype: [String]
    // Means that user can have multiple types
    // if simple usertype: String
});

Account.plugin(passportLocalMongoose);
Account.plugin(uniqueValidator, { message: 'The email {PATH} already exists. Please check your email address.' });


module.exports = mongoose.model('Account', Account);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var bcrypt = require('bcrypt-nodejs');

var Account = new Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    usertype: String
    // if multiple usertypes needed, [String]
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);
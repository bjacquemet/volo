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
    usertype: [String],
    last_sign_in: Date,
    updated_at: Date,
    created_at: {type: Date, default: Date.now()}
    // Means that user can have multiple types
    // if simple usertype: String
});

Account.pre('update', function(next) {
  console.log('------------->>>>>> update updated_at')
  this.update({},{ $set: { updated_at: new Date() } });
  next();
});
Account.pre('findOneAndUpdate', function(next) {
  console.log('------------->>>>>> findandupdate updated_at')
  this.update({},{ $set: { updated_at: new Date() } });
  next();
});

Account.plugin(passportLocalMongoose);
Account.plugin(uniqueValidator, { message: 'The {PATH} already exists. Please check your email address.' });


module.exports = mongoose.model('Account', Account);
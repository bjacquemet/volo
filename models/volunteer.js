var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosastic = require('mongoosastic')
var elasticsearch = require('elasticsearch')

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

// Set up elastic search to allow search on volunteers first_name and lastname

var esHost = process.env.SEARCHBOX_SSL_URL || 'localhost:9200';
console.log(esHost);
var esClient = new elasticsearch.Client({host: esHost, curlDebug:true});

Volunteer.plugin(mongoosastic, {esClient:esClient});

var VolunteerModel = mongoose.model('Volunteer', Volunteer),
                     stream = VolunteerModel.synchronize(),
                     count = 0;

                     stream.on('data', function(err, doc){
                       count++;
                     });
                     stream.on('close', function(){
                       console.log('indexed ' + count + ' documents!');
                     });
                     stream.on('error', function(err){
                       console.log(err);
                     });

module.exports = VolunteerModel;
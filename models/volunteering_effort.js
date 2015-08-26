var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Volunteering_effort = new Schema({
    // corporate_id: {type: Schema.Types.ObjectId, ref: "Corporate"},
    // photo: { data: Buffer, contentType: String, path: String },
    // caption: String
});


module.exports = mongoose.model('Volunteering_effort', Volunteering_effort);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ValidationPending = new Schema({
    activity: {type: Schema.Types.ObjectId, ref: "Activity", required:true},
    volunteer: {type: Schema.Types.ObjectId, ref: "Volunteer", required:true },
    role: {type: Schema.Types.ObjectId, ref: "Role", required:true},
    start_date: {type: Date, required:true},
    end_date: {type: Date},
    hours: {type: Number, required:true},
    skills: [{type: Schema.Types.ObjectId, ref: "Skill"}],
    referee:{name: String, phone_number: String, email: String},
    validated_via_email: Boolean,
    sent: Boolean,
    created_at: {type: Date, default: Date.now()}
});


module.exports = mongoose.model('ValidationPending', ValidationPending);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Activity = new Schema({
    experience_id: {type: Schema.Types.ObjectId, ref: "Experience", required:true},
    // manager_id: {type: Schema.Types.ObjectId, ref: "Manager"}
    role_id: {type: Schema.Types.ObjectId, ref: "Role", required:true},
    feedback: String,
    start_date: {type: Date, required:true},
    end_date: {type: Date},
    hours: {type: Number, required:true},
    validated: {type: String, enum: ['pending', 'accepted', 'declined'], required: true},
    decline_reason: String,
    skills: [{type: Schema.Types.ObjectId, ref: "Skill"}],
    notes: String,
    referee:{name: String, phone_number: String, email: String}
});


module.exports = mongoose.model('Activity', Activity);
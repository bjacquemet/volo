var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Activity = new Schema({
    // experience_id: {type: Schema.Types.ObjectId, ref: "Experience"},
    // manager_id: {type: Schema.Types.ObjectId, ref: "Manager"}
    // role_id: {type: Schema.Types.ObjectId, ref: "Role"}
    // feedback: String,
    // start_date: Date,
    // end_date: Date,
    // hours: Number,
    // validated: {type: String, enum: [pending, accepted, declined]},
    // decline_reason: String,
    // skills: [{type: Schema.Types.ObjectId, ref: "Skill"}],
    // referee:{name: String, phone_number: String, email: String}
});


module.exports = mongoose.model('Activity', Activity);
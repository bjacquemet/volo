var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Activity = new Schema({
    experience: {type: Schema.Types.ObjectId, ref: "Experience", required: true},
    volunteer: {type: Schema.Types.ObjectId, ref: "Volunteer", required: true},
    // manager_id: {type: Schema.Types.ObjectId, ref: "Manager"}
    role: {type: Schema.Types.ObjectId, ref: "Role", required: true},
    feedback: String,
    start_date: {type: Date, required: true},
    end_date: {type: Date},
    hours: {type: Number, required: true},
    validated: {type: String, enum: ['pending', 'accepted', 'declined'], required: true},
    decline_reason: String,
    validation_date: Date,
    skills: [{type: Schema.Types.ObjectId, ref: "Skill"}],
    notes: String,
    validated_via_email: Boolean,
    referee: {name: String, phone_number: String, email: String},
    updated_at: {type: Date, default: Date.now()},
    created_at: {type: Date, default: Date.now()}
});

Activity.pre('update', function (next) {
    console.log('------------->>>>>> update updated_at')
    this.update({}, {$set: {updated_at: new Date()}});
    next();
});
Activity.pre('findOneAndUpdate', function (next) {
    console.log('------------->>>>>> findandupdate updated_at')
    this.update({}, {$set: {updated_at: new Date()}});
    next();
});


module.exports = mongoose.model('Activity', Activity);
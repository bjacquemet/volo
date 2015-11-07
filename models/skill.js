var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Skill = new Schema({
    name: {type: String, unique: true},
    created_by: {type: Schema.Types.ObjectId, ref: "Volunteer", required: true},
    suggested_by_volunteer: Boolean,
    updated_at: Date,
    created_at: {type: Date, default: Date.now()}
});

Skill.pre('update', function (next) {
    console.log('------------->>>>>> update updated_at');
    this.update({}, {$set: {updated_at: new Date()}});
    next();
});
Skill.pre('findOneAndUpdate', function (next) {
    console.log('------------->>>>>> findandupdate updated_at');
    this.update({}, {$set: {updated_at: new Date()}});
    next();
});

module.exports = mongoose.model('Skill', Skill);
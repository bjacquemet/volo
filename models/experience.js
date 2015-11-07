var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Experience = new Schema({
    volunteer: {type: Schema.Types.ObjectId, ref: "Volunteer", required: true},
    nonprofit: {type: Schema.Types.ObjectId, ref: "Nonprofit", required: true},
    description: String,
    start_date: Date,
    end_date: Date,
    sum_validated_hours: Number,
    activities: [{type: Schema.Types.ObjectId, ref: "Activity"}],
    recommendation_number: Number,
    updated_at: Date,
    created_at: {type: Date, default: Date.now()}
});

Experience.pre('update', function (next) {
    console.log('------------->>>>>> update updated_at');
    this.update({}, {$set: {updated_at: new Date()}});
    next();
});
Experience.pre('findOneAndUpdate', function (next) {
    console.log('------------->>>>>> findandupdate updated_at');
    this.update({}, {$set: {updated_at: new Date()}});
    next();
});

module.exports = mongoose.model('Experience', Experience);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Experience = new Schema({
    volunteer: {type: Schema.Types.ObjectId, ref: "Volunteer", required:true },
    nonprofit: {type: Schema.Types.ObjectId, ref: "Nonprofit", required:true },
    description: String,
    start_date: Date,
    end_date: Date,
    sum_validated_hours: Number,
    activities: [{type: Schema.Types.ObjectId, ref: "Activity"}]
});


module.exports = mongoose.model('Experience', Experience);
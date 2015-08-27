var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Experience = new Schema({
    volunteer_id: {type: Schema.Types.ObjectId, ref: "Volunteer", required:true },
    nonprofit_id: {type: Schema.Types.ObjectId, ref: "Nonprofit", required:true },
    description: String,
    start_date: Date,
    end_date: Date,
    sum_validated_hours: Number
});


module.exports = mongoose.model('Experience', Experience);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Experience = new Schema({
    volunteer_id: {type: Schema.Types.ObjectId, ref: "Volunteer"},
    nonprofit_id: {type: Schema.Types.ObjectId, ref: "Nonprofit"},
    description: String,
    start_date: Date,
    end_date: Date,
    Sum_validated_hours: Number
});


module.exports = mongoose.model('Experience', Experience);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Recommendation = new Schema({
    activity: {type: Schema.Types.ObjectId, ref: "Activity", required: true},
    referee_name: String,
    recommendation: {type: String, required: true}
});


module.exports = mongoose.model('Recommendation', Recommendation);
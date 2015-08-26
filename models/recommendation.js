var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Recommendation = new Schema({
    // experience_id: {type: Schema.Types.ObjectId, ref: "Experience"},
    // comment: String
});


module.exports = mongoose.model('Recommendation', Recommendation);
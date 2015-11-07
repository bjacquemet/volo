var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UniversityAdminRights = new Schema({
    university: {type: Schema.Types.ObjectId, ref: "University", required: true},
    right: String,
    created_at: {type: Date, default: Date.now()}
});

module.exports = mongoose.model('UniversityAdminRights', UniversityAdminRights);

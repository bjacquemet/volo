var Recommendation = require('../models/recommendation');
var Experience = require('../models/experience');
var Activity = require('../models/activity');

exports.getRecofromExperienceId = function (experienceId, callback) {
    Experience.findById(experienceId, function (err, experience) {
        Recommendation.find({activity: {$in: experience.activities}}, function (err, reco) {
            if (err) callback(err, null);
            else {
                callback(null, reco.length);
            }
        })
    })
}

exports.getRecofromVolunteerId = function (volunteerId, callback) {
    Activity.find({volunteer: volunteerId}).exec(function (err, activities) {
        var recommendations = [];
        var act_length = activities.length,
            i = 1;
        if (activities.length == 0) callback(null, {recommendations: []});
        activities.forEach(function (activity) {
            Recommendation.findOne({activity: activity._id}).populate('activity').exec(function (err, reco) {
                if (err) console.log(err);
                else {
                    if (reco) {
                        Experience.findOne({activities: reco.activity._id}).populate('nonprofit').exec(function (err, exp) {
                            if (err) {
                                console.log(err);
                                callback(err, null);
                            }
                            else {
                                recommendations.push({recommendation: reco, nonprofit: exp.nonprofit.name});
                                if (act_length == i) {
                                    callback(null, {recommendations: recommendations});
                                }
                                else {
                                    i++;
                                }
                            }
                        })
                    }
                    else {
                        if (act_length == i) {
                            callback(null, {recommendations: recommendations});
                        }
                        else i++;
                    }
                }
            });
        });
    })
}
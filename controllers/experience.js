var Experience = require('../models/experience');
var Activity = require('../models/activity');
var Volunteer = require('../models/volunteer');
var ValidationPending = require('../models/validation_pending');
var crypto = require('crypto');
var async = require('async');


function getVolunteerExperiences(volunteer_id, callback) {
    var query = {}
    if (volunteer_id != null) query = {'volunteer': volunteer_id};
    Experience.find(query).populate('activities nonprofit')
        .exec(function (err, experiences) {
            if (err) {
                console.log(err);
            }
            else {
                Experience.populate(experiences, {
                        path: 'activities.role',
                        model: 'Role'
                    },
                    function (err, experiences_role) {
                        if (err) console.log(err);
                        else {
                            // populate skills
                            Experience.populate(experiences_role, {
                                path: 'activities.skills',
                                model: "Skill"
                            }, function (err, experiences_skills_roles) {
                                if (err) console.log(err);
                                else {
                                    // The following foreach on experiences then activities lets
                                    // us calculate the sum of hours accumulated and skills list
                                    // for each experience
                                    // Todo: improve that to include it in the Experience Schema (if possible)
                                    var complete_experiences = [];
                                    experiences_skills_roles.forEach(function (experience) {
                                        var hours = 0,
                                            skills_list = [];
                                        experience.activities.forEach(function (activity) {
                                            if (activity.validated == 'accepted') {
                                                hours += activity.hours;
                                                activity.skills.forEach(function (skill) {
                                                    if (skills_list.indexOf(skill) < 0) skills_list.push(skill);
                                                });
                                            }
                                        });
                                        // reformat the json
                                        experience = JSON.stringify(experience);
                                        experience = JSON.parse(experience);
                                        // end reformat json object

                                        experience.totalHours = hours
                                        experience.skills_list = skills_list;
                                        complete_experiences.push(experience);
                                    });
                                    // End total hours calculation and skills list aggregation
                                    callback({
                                        experiences: complete_experiences
                                    });
                                }
                            })
                        }
                    }
                );
            }
        });
}

exports.getByVolunteerId = getVolunteerExperiences;

exports.new = function (req, res) {
    if (!req.body.volunteer || !req.body.nonprofit || !req.body.role || !req.body.skills || !req.body.hours || !req.body.s_date || !req.body.referee_name || !req.body.referee_email || !req.body.referee_phone) {
        res.status(400);
        res.send('Field(s) missing');
    }
    else {
        var v_id = req.body.volunteer,
            n_id = req.body.nonprofit,
            desc = req.body.description,
            role = req.body.role,
            skills = req.body.skills,
            hours = req.body.hours,
            start_date = req.body.s_date,
            end_date = req.body.e_date,
            referee_name = req.body.referee_name,
            referee_email = req.body.referee_email.toLowerCase(),
            referee_phone = req.body.referee_phone,
            validated_via_email = req.body.validated_via_email || false,
            notes = req.body.notes;
        var newExperience = Experience(
            {
                volunteer: v_id,
                nonprofit: n_id,
                description: desc
            });
        newExperience.save(function (err, experience) {
            if (err) console.log(err);
            else {
                console.log(experience._id);
                var activity_json = {
                    experience: experience._id,
                    volunteer: v_id,
                    role: role,
                    skills: skills,
                    start_date: start_date,
                    hours: hours,
                    validated: 'pending',
                    validated_via_email: validated_via_email,
                    notes: notes,
                    referee: {
                        name: referee_name,
                        phone_number: referee_phone,
                        email: referee_email
                    }
                };
                if (end_date != '') activity_json[end_date] = end_date;

                var newActivity = Activity(activity_json);
                newActivity.save(function (err, activity) {
                    if (err) console.log(err);
                    else {
                        Experience.findByIdAndUpdate(experience._id, {$push: {activities: activity._id}}, function (err, exp) {
                            if (err) console.log(err);
                            else {
                                ValidationPending.findOne({referee_email: referee_email}, function (err, validation) {
                                    if (err) console.log(err);
                                    if (validation) {
                                        var validation_pending = {
                                            activity: activity._id,
                                            referee: {
                                                name: referee_name,
                                                phone_number: referee_phone
                                            },
                                            validated_via_email: validated_via_email,
                                            sent: false
                                        };
                                        ValidationPending.findByIdAndUpdate(validation._id, {$push: {activities: validation_pending}}, function (err, validation_added) {
                                            if (err) console.log(err);
                                            else res.sendStatus(201);
                                        })
                                    }
                                    else {
                                        async.waterfall([
                                                function (done) {
                                                    crypto.randomBytes(20, function (err, buf) {
                                                        var token = buf.toString('hex');
                                                        done(err, token);
                                                    });
                                                },
                                                function (token, done) {
                                                    var validation_pending = {
                                                        referee_email: referee_email,
                                                        token: token,
                                                        activities: [{
                                                            activity: activity._id,
                                                            referee: {
                                                                name: referee_name,
                                                                phone_number: referee_phone
                                                            },
                                                            validated_via_email: validated_via_email,
                                                            sent: false
                                                        }]
                                                    };
                                                    var newValidation = ValidationPending(validation_pending);
                                                    newValidation.save(function (err, validation) {
                                                        if (err) console.log(err);
                                                        else res.sendStatus(201);
                                                    });
                                                }
                                            ],
                                            function (err) {
                                                if (err) return next(err);
                                                res.sendStatus(500);
                                            })
                                    }
                                })
                            }
                        });
                    }
                });
            }
        })
    }
};

exports.update = function (req, res) {
    if (!req.body.name || !req.body.value || !req.body.pk) {
        res.status(400);
        res.send('Field(s) missing');
    }
    else {
        var field = req.body.name;
        var value = req.body.value;
        if (field == 'description') {
            Experience.findByIdAndUpdate({_id: req.body.pk}, {description: req.body.value}, function (err, xp) {
                if (err) {
                    res.status(400);
                    res.send(err);
                }
                else res.sendStatus(200);
            })
        }
        else {
            console.log("Field doesn't exist");
            res.status(400)
            res.send("Field doesn't exist");
        }
    }
}

exports.getByNonprofitId = function (req, res) {
    if (req.params.id) {
        Experience.find({nonprofit: req.params.id}).distinct('volunteer').exec(function (err, volunteers) {
            if (err) console.log(err);
            else {
                Volunteer.find({_id: {$in: volunteers}}).select('first_name last_name photo').exec(function (err, volunteers) {
                    if (err) {
                        console.log(err);
                        res.sendStatus(400);
                    }
                    else {
                        res.send(volunteers)
                    }
                });
            }
        })
    }
    else {
        res.sendStatus(400);
    }
}

///////////////////////////////////////////////////////////////////
//////////////////  ARCHIVES (functions not used) ////////////////
/////////////////////////////////////////////////////////////////

exports.getByVolunteerIdParam = function (req, res) {
    getVolunteerExperiences(req.params.id, function (response) {
        res.send(response.experiences);
    })
};

exports.list = function (req, res) {
    getVolunteerExperiences(null, function (response) {
        res.send(response.experiences);
    });
};
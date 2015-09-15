var Activity = require('../models/activity');
var Experience = require('../models/experience');
var Skill = require('../models/skill');
var Volunteer = require('../models/volunteer');
var Role = require('../models/role');
var Recommendation = require('../models/recommendation');
var ValidationPending = require('../models/validation_pending');
var mongoose = require('mongoose');
var crypto = require('crypto');
var async = require('async');


function getVolunteerSkills (volunteer_id, callback) {
  volunteer_id = mongoose.Types.ObjectId(volunteer_id);

  Activity
  .aggregate(
      [{
        $match:
        {
          volunteer: volunteer_id
        }
      }
      ,{
        $unwind: "$skills"
      },
      {
        $group: {
          _id: "$skills",
          sum_hours: {$sum: "$hours"}
        }
      },
      {
        $sort: {
          sum_hours: -1
        }
      }
      ],
    function (err, results) {
      if (err) {
        console.log(err);
        return
      }
      console.log(results);
      var hours_per_skill = [];
      Skill.populate(results, {path:'_id', select: 'name'}, function (err, skills) {
        if (err) 
          {
            console.log(err);
            callback(err, null);
          }
        else callback(null, {skills: skills})
      });
    }
    );
};

// function GetActivityByRefereeEmail (referee_email) {
//   Activity.find({referee.email: referee_email}).exec(function (err, activities){
//     res.send(activities);
//   });
// }

exports.allPending = function (req, res) {
  Activity.aggregate(
    [
    {$match: {validated: 'pending'}},
    {
      $project: {
        volunteer : 1,
        validated: 1,
        role: 1,
        start_date: 1,
        end_date: 1,
        hours: 1,
        skills: 1,
        referee:
          {
            email: "$referee.email",
            name: "$referee.name"
          }
      }
    },
    {
      $group:
      {
        _id: '$referee.email',
        activities: {$push: "$$ROOT"},
        count: {$sum: 1},
      }
    }
    ], 
    function (err, activity) {
      if (err) console.log(err);
      else {
        Skill.populate(activity, {path:'activities.skills', select: 'name'}, function (err, skill_activity) {
          Role.populate(skill_activity, {path: 'activities.role', select: "name"}, function (err, skill_activity_role) {
            Volunteer.populate(skill_activity_role, {path: "activities.volunteer", select: 'first_name last_name'}, function (err, full_activity) {
              res.send(full_activity);
            })
          })
        })
      }
    });
};

exports.ActivityToBeValidatedByRefereeEmail = function (req, res) {
  ValidationPending.find({referee_email: req.query.email, token: req.query.token}, function (err, validationOK) {
    if (err) console.log(err);
    else {
      if (validationOK.length > 0) 
      {
        Activity.find({'referee.email': validationOK.referee_email, validated: "pending"}).populate('volunteer role').exec(function (err, activities) {
          Skill.populate(activities, {path:'skills', select: 'name'}, function (err, full_activities) {
            if (err) console.log(err);
            else {
              res.render('activity/validation', { title: 'Activities pending validation', 
              user: req.user, 
              activities: full_activities });
            }
          });
        });
      }
      else {
        res.render('activity/validation', { title: 'Activities pending validation', 
        user: req.user, 
        authorized: false });
      }
    }
  })
};

exports.getVolunteerSkills = getVolunteerSkills;

exports.accept = function (req, res) {
  Activity.findOneAndUpdate({_id: req.body.activityId}, {validated: "accepted"}, function (err, activity) {
    if (err) res.send(err);
    else {
      if (req.body.recommendation) {
        var recommendation_json = {
          activity: req.body.activityId,
          referee_name: req.body.referee,
          recommendation: req.body.recommendation
        }
        var newReco = Recommendation(recommendation_json);
        newReco.save(function (err, recom) {
          if (err) console.log(err);
          else {
            Experience.findByIdAndUpdate(activity.experience, {$inc:{recommendation_number: 1}}, function (err, experience) {
              if (err) console.log(err);
              else res.sendStatus(201);
            })
          }
        })
      }
      else res.sendStatus(201);
    }
  });
}

exports.decline = function (req, res) {
  Activity.findOneAndUpdate({_id: req.body.activityId}, {validated: "declined", decline_reason: req.body.declineReason}, function (err, activity) {
    if (err) res.send(err);
    else {
      res.sendStatus(201);
    }
  });
}

exports.getSkills = function (req, res) {
    var volunteer_id = req.params.id;
    volunteer_id = mongoose.Types.ObjectId(volunteer_id.toString());
    // var o = {};
    // o.map = function (){
    //   var hours = this.hours;
    //   print(hours);
    //   this.skills.forEach(function (skill) {
    //       emit(skill, hours);
    //     });
    // };

    // o.reduce = function (key, value) {
    //   var reduceSkills = {hours:0};
    //   value.forEach(function (hours) {
    //     reduceSkills.hours += hours;
    //   });
    //     return reduceSkills;
    // },{
    //   query: {volunteer: volunteer_id},
    //   out: 'hours_per_skill'
    // }
    
    // Activity.mapReduce(o, function (err, results) {
    //   var hours_per_skill = []
    //   if (err) {
    //     console.log(err);
    //     return
    //   }
    //   results.forEach(function(result){

    //   })
    //   Skill.populate(results, {path:'_id'}, function (skills) {
    //     if (typeof(results.value) != 'undefined') var element = {skill: skills, hours: results.value.hours};
    //     else var element = {skill: skills, hours: results.hours};
    //     console.log(element);
    //     hours_per_skill.push(element);
    //   });
    //   console.log(hours_per_skill);

    //   // else {
    //   //   var i =0, hours_per_skill = [];
    //   //   results.forEach(function (hours_skills){
    //   //     var element = {skill: hours_skills._id, hours: hours_skills.value.hours};
    //   //     hours_per_skill.push(element);
    //   //   });
    //   //   res.send(hours_per_skill);
    //   //   };
    // });

  Activity
  .aggregate(
      [{
        $match:
        {
          volunteer: volunteer_id
        }
      }
      ,{
        $unwind: "$skills"
      },
      {
        $group: {
          _id: "$skills",
          sum_hours: {$sum: "$hours"}
        }
      }
      ],
    function (err, results) {
      if (err) {
        console.log(err);
        return
      }
      console.log(results);
      var hours_per_skill = [];
      Skill.populate(results, {path:'_id', select: 'name'}, function (err, skills) {
        console.log('obj');
        console.log(skills);
        callback({skills: skills})
        res.send(skills);
        // if (typeof(results.value) != 'undefined') var element = {skill: skills, hours: results.value.hours};
        // else var element = {skill: skills, hours: results.hours};
        // console.log(element);
        // hours_per_skill.push(element);
      });
      // console.log(hours_per_skill);
    }
    );
}

exports.list = function(req,res) {
    Activity.find({}).populate('role skills').exec(function(err,activities) {
      if(err) res.send(err);
      else res.send(activities);
    });
};

exports.new = function(req,res, next) {
  var v_id = req.body.volunteer,
      e_id = req.body.experience,
      role = req.body.role,
      skills = req.body.skills,
      hours = req.body.hours,
      start_date = req.body.s_date,
      end_date = req.body.e_date,
      referee_name = req.body.referee_name,
      referee_email = req.body.referee_email,
      referee_phone = req.body.referee_phone,
      notes = req.body.notes;

  var activity_json = {
    experience: e_id,
    volunteer: v_id,
    role: role,
    skills: skills,
    start_date: start_date,
    hours: hours,
    validated: 'pending',
    notes: notes,
    referee:
    {
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
      Experience.findByIdAndUpdate(e_id, { $push: {activities: activity._id}}, function (err, exp) {
        if (err) console.log(err);
        else {
          ValidationPending.findOne({referee_email:referee_email}, function (err, validation) {
            if (err) console.log(err);
            if (validation) {
              var validation_pending = {
                activity: activity._id,
                referee: {
                  name: referee_name,
                  phone_number: referee_phone
                },
                validated_via_email: false,
                sent: false
              };
              ValidationPending.findByIdAndUpdate(validation._id, { $push: {activities: validation_pending}}, function (err, validation_added) {
                if (err) console.log(err);
                else res.sendStatus(201);
              })
            }
            else {
              async.waterfall([
                function (done) {
                  crypto.randomBytes(20, function(err, buf) {
                    var token = buf.toString('hex');
                    done(err, token);
                  });
                },
                function (token, done) {
                  var validation_pending = {
                    referee_email: referee_email,
                    token: token,
                    activities:
                    [{
                      activity: activity._id,
                      referee: {
                        name: referee_name,
                        phone_number: referee_phone
                      },
                      validated_via_email: false,
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
      })  
    }
  });
}

exports.getByVolunteerId = function(req,res) {
    Activity.find({volunteer: req.params.id}).populate('role skills').exec(function(err,activities) {
      if(err) res.send(err);
      else res.send(activities);
    });
};

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
var nodemailer = require('nodemailer');


function getVolunteerSkills (volunteer_id, callback) {
  volunteer_id = mongoose.Types.ObjectId(volunteer_id);

  Activity
  .aggregate(
      [{
        $match:
        {
          volunteer: volunteer_id,
          validated: 'accepted'
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

exports.listActivitiesForAdmin = function (req, res) {
  var perPage = 2, 
      page = req.query.page > 0 ? req.query.page : 0,
      count,
      skip = perPage * page;
  Activity.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$updated_at" }},
        activities: {$push: "$$ROOT"}
      }
    },
    {
      $sort: {
        "_id": -1
      }
    },
    {
      $skip: skip
    },
    {
      $limit: perPage
    }
    ], 
    function (err, activities) {
      if (err) console.log(err);
      else {
        Activity.aggregate([
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$updated_at" }},
              activities: {$push: "$$ROOT"}
            }
          }],
          function (err, all_activities) {
            count = all_activities.length;
            Skill.populate(activities, {path:'activities.skills', select: 'name'}, function (err, skill_activity) {
              Role.populate(skill_activity, {path: 'activities.role', select: "name"}, function (err, skill_activity_role) {
                Volunteer.populate(skill_activity_role, {path: "activities.volunteer", select: 'first_name last_name'}, function (err, skill_activity_role_vol) {
                  Experience.populate(skill_activity_role_vol, {path: "activities.experience", model: 'Experience', select: 'nonprofit'}, function (err, skill_activity_role_vol_exp) {
                    Experience.populate(skill_activity_role_vol_exp, {path: 'activities.experience.nonprofit', model: 'Nonprofit'}, function (err, full_activities) {
                      // res.send(full_activities);
                      res.locals.createPagination = function (pages, page) {
                        var url = require('url')
                          , qs = require('querystring')
                          , params = qs.parse(url.parse(req.url).query)
                          , str = ''
                        params.page = 0
                        var clas = page == 0 ? "active" : "no"
                        str += '<li class="'+clas+'"><a href="?'+qs.stringify(params)+'">First</a></li>'
                        for (var p = 1; p < pages; p++) {
                          params.page = p
                          clas = page == p ? "active" : "no"
                          str += '<li class="'+clas+'"><a href="?'+qs.stringify(params)+'">'+ p +'</a></li>'
                        }
                        params.page = --p
                        clas = page == params.page ? "active" : "no"
                        str += '<li class="'+clas+'"><a href="?'+qs.stringify(params)+'">Last</a></li>'

                        return str
                      };
                      res.render('activity/adminList',
                        { title: 'Activities pending validation', 
                          user: req.user, 
                          activities: full_activities,
                          page: page,
                          pages: count / perPage
                      });
                    })
                  })
                })
              })
            })
          }
        );
      }
    }
  )
}

exports.validateActivitiesByAdmin = function (req, res) {
  Activity.find({validated_via_email: true, validated: "pending"}).populate('volunteer role').exec(function (err, activities) {
    Skill.populate(activities, {path:'skills', select: 'name'}, function (err, full_activities) {
      if (err) console.log(err);
      else {
        res.render('activity/adminValidation', { title: 'Activities pending validation to be validated by Admin', 
        user: req.user, 
        activities: full_activities });
      }
    });
  });
};

exports.ActivityToBeValidatedByRefereeEmail = function (req, res) {
  ValidationPending.find({referee_email: req.query.email, token: req.query.token}, function (err, validationOK) {
    if (err) console.log(err);
    else {
      if (validationOK.length > 0) 
      {
        console.log(validationOK);
        Activity.find({'referee.email': validationOK[0].referee_email, validated: "pending"}).populate('volunteer role').exec(function (err, activities) {
          Skill.populate(activities, {path:'skills', select: 'name'}, function (err, full_activities) {
            if (err) console.log(err);
            else {
              console.log(full_activities);
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

function sendEmailIfDeclined (activityId) {
  Activity.findById(activityId).populate('role skills volunteer').exec(function (err, activity) {
    var skills= [];
    activity.skills.forEach(function (skill) {
      skills.push(skill.name);
    });
    var smtpTransport = nodemailer.createTransport({
      host: 'smtp.mailgun.org',
      service: "Mailgun",
      auth: {
        user: "postmaster@mg.volo.org.uk",
        pass: "18682498971f9e94b4c22b6433284351"
      }
    });

    var mailOptions = {
      to: "baptiste.jacquemet@gmail.com",
      from: 'VOLO <password@volo.org.uk>',
      subject: "Activity declined",
      text: 'Hi Melissa!'+ '\n\n' +
        'The following activity has been declined:' + '\n'+
        "Volunteer: " + activity.volunteer.first_name + ' ' + activity.volunteer.last_name + '\n' +
        "You can see his profile here: http://localhost:3000/volunteer/" + activity.volunteer._id + '\n\n' +
        "ACTIVITY: " + '\n' +
        "Role: " + activity.role.name + '\n' +
        "Skills: " + skills.join(', ')+ '\n' +
        "Start date: " + activity.start_date + '\n' +
        "End date: " + activity.end_date + '\n' +
        "Number of hours: " + activity.hours + ' hours' + '\n' +
        "Referee name: " + activity.referee.name+ '\n' +
        "Referee phone number: " + activity.referee.phone_number+ '\n' +
        "Referee email: " + activity.referee.email+ '\n' +
        "Status: " + activity.validated+ '\n' +
        "Decline reason: " + activity.decline_reason+ '\n\n' +
        "Have a great day"         
    };
    smtpTransport.sendMail(mailOptions, function (err) {
      if (err) console.log(err);
    })
  })
}

exports.decline = function (req, res) {
  Activity.findOneAndUpdate({_id: req.body.activityId}, {validated: "declined", decline_reason: req.body.declineReason}, function (err, activity) {
    if (err) res.send(err);
    else {
      sendEmailIfDeclined(req.body.activityId);
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
      validated_via_email = req.body.validated_via_email || false,
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
    validated_via_email: validated_via_email,
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
                validated_via_email: validated_via_email,
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
      })  
    }
  });
}

exports.update_notes = function (req, res) {
  var notes = req.body.notes,
      activity = req.body.activity;
  var json = {notes: notes};
  console.log(json);
  console.log(activity);
  Activity.findByIdAndUpdate(activity, json, function (err, activity) {
    if (err) {
      console.log(err);
      res.send(err);
    }
    else {
      res.sendStatus(200);
    }
  })
}

exports.update = function (req, res) {
  var role = req.body.role,
      skills = req.body.skills,
      hours = req.body.hours,
      start_date = req.body.s_date,
      end_date = req.body.e_date,
      notes = req.body.notes,
      activity = req.body.activity;
  var json = {
    role: role,
    skills: skills,
    start_date: start_date,
    hours: hours,
    notes: notes
  };
  console.log(json);
  console.log(activity);
  if (end_date != '') activity_json[end_date] = end_date;
  Activity.findByIdAndUpdate(activity, json, function (err, activity) {
    if (err) {
      console.log(err);
      res.send(err);
    }
    else {
      res.sendStatus(200);
    }
  })
}

exports.get = function (req, res) {
  Activity.findOne({_id: req.params.id}).populate("role skills").exec(function (err, activity) {
    if (err) res.send(err);
    else {
      var skill_id_array = [],
          skill_name_array = [];
      activity.skills.forEach(function (skill) {
        console.log(skill._id);
        skill_id_array.push(skill._id);
        skill_name_array.push(skill.name);
      })
      activity = JSON.stringify(activity);
      activity = JSON.parse(activity);
      activity.skills_list = skill_id_array;
      activity.skills_list_name = skill_name_array;
      res.send(activity);
    }
  })
}

exports.getByVolunteerId = function(req,res) {
    Activity.find({volunteer: req.params.id}).populate('role skills').exec(function(err,activities) {
      if(err) res.send(err);
      else res.send(activities);
    });
};

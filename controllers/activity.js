var Activity = require('../models/activity');
var Experience = require('../models/experience');

exports.list = function(req,res) {
    Activity.find({}).populate('role skills').exec(function(err,activities) {
      if(err) res.send(err);
      else res.send(activities);
    });
};

exports.new = function(req,res) {
  console.log(req.body);
  console.log('body end');
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
      Experience.findByIdAndUpdate(e_id, { $push: {activities: activity._id}}, function(err, exp) {
        if (err) console.log(err);
        else res.sendStatus(201);
      });  
    }  
  });
};

exports.getByVolunteerId = function(req,res) {
    Activity.find({volunteer: req.params.id}).populate('role skills').exec(function(err,activities) {
      if(err) res.send(err);
      else res.send(activities);
    });
};

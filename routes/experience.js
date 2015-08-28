var express = require('express');
var router = express.Router();
var Experience = require('../models/experience');
var Activity = require('../models/activity');

router.get("/list", function(req,res) {
    Experience.find({}).select('volunteer nonprofit description start_date end_date sum_validated_hours').exec(function(err,experiences) {
      res.send(experiences);
    });
});

router.get("/volunteer/:id", function(req,res) {
    Experience.find({volunteer: req.params.id}).select('volunteer nonprofit description start_date end_date sum_validated_hours').exec(function(err,experiences) {
      res.send(experiences);
    });
});

router.post("/new", function(req,res) {
  console.log('body:');
  console.log(req.body);
  console.log('body end');
  var v_id = req.body.volunteer,
      n_id = req.body.nonprofit,
      desc = req.body.description,
      role = req.body.role,
      skills = req.body.skills,
      hours = req.body.hours,
      start_date = req.body.s_date,
      end_date = req.body.e_date,
      referee_name = req.body.referee_name,
      referee_email = req.body.referee_email,
      referee_phone = req.body.referee_phone,
      notes = req.body.notes;
  // if (Object.prototype.toString.call(name) === '[object Array]')
  // {
  //   var name_is_array = true;
  //   name = name[0];
  // }
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

      // To be change: POST to /activity/new
      var newActivity = Activity(
      {
        experience: experience._id,
        volunteer: v_id,
        role: role,
        skills: skills,
        start_date: start_date,
        end_date: end_date,
        hours: hours,
        validated: 'pending',
        notes: notes,
        referee:
        {
          name: referee_name,
          phone_number: referee_phone,
          email: referee_email
        }
      });
      newActivity.save(function (err, activity) {
        if (err) console.log(err);
        else {
          Experience.findByIdAndUpdate(experience._id, { $push: {activities: activity._id}}, function(err, exp) {
            if (err) console.log(err);
            else res.sendStatus(201);
          });  
        }  
      });
    }
  })
});

module.exports = router;

var express = require('express');
var router = express.Router();
var Experience = require('../models/experience');
var Activity = require('../models/activity');

router.get("/list", function(req,res) {
    Experience.find({}).select('volunteer_id nonprofit_id description start_date end_date sum_validated_hours').exec(function(err,experience) {
      res.send(experience);
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
    volunteer_id: v_id,
    nonprofit_id: n_id,
    description: desc
  });
  newExperience.save(function (err, experience) {
    if (err) console.log(err);
    else {
      console.log(experience._id);
      // res.sendStatus(201);
      var newActivity = Activity(
      {
        experience_id: experience._id,
        role_id: role,
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
      newActivity.save(function (err) {
        if (err) console.log(err);
        else res.sendStatus(201);
      });
    }
  })
});

module.exports = router;

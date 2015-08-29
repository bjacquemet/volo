var Experience = require('../models/experience');
var Activity = require('../models/activity');

exports.list = function(req,res) {
    Experience.find({}).populate('nonprofit activities').exec(function(err,experiences) {
      if(err) res.send(err);
      else {
        // populate role
        Experience.populate(experiences, {
            path: 'activities.role',
            model: 'Role'
          }, 
          function (err, experiences_role) {
            if (err) console.log(err);
            else
            {
              console.log(experiences_role);
              // populate skills
              Experience.populate(experiences_role, {
                path: 'activities.skills',
                model: "Skill"
              }, function(err, experiences_role_skills) {
                if (err) console.log(err);
                else
                {
                  res.send(experiences_role_skills);
                }
              })
            }
          });
      }
    });
};

exports.new = function(req,res) {
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
          Experience.findByIdAndUpdate(experience._id, { $push: {activities: activity._id}}, function(err, exp) {
            if (err) console.log(err);
            else res.sendStatus(201);
          });  
        }  
      });
    }
  })
};

exports.getByVolunteerId = function(req,res) {
    Experience.find({volunteer: req.params.id}).populate('nonprofit activities').exec(function(err,experiences) {
      if(err) res.send(err);
      else {
        // populate role
        Experience.populate(experiences, {
            path: 'activities.role',
            model: 'Role'
          }, 
          function (err, experiences_role) {
            if (err) console.log(err);
            else
            {
              // populate skills
              Experience.populate(experiences_role, {
                path: 'activities.skills',
                model: "Skill"
              }, function(err, experiences_role_skills) {
                if (err) console.log(err);
                else
                {
                  res.json(experiences_role_skills);
                }
              })
            }
          });
      }
    });
};
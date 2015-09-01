var Activity = require('../models/activity');
var Experience = require('../models/experience');
var Skill = require('../models/skill');
var mongoose = require('mongoose');

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
        callback({skills: skills})
      });
    }
    );
};

exports.getVolunteerSkills = getVolunteerSkills;

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

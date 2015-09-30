var Skill = require('../models/skill');

exports.list = function(req, res) {
  Skill.find({}).select('_id name').exec(function (err,skills) {
    if (err) res.sendStatus(400);
    else {
      // res.setHeader('Cache-Control', 'public, max-age=31557600');
      res.send(skills);
    }
  });
};

exports.new =function(req,res) {
  if (!req.body.name || !req.body.suggested_by_volunteer || !req.body.created_by ) {
    res.status(400);
    res.send('Field(s) missing');
  }
  else
  {
    var name = req.body.name;
    if (Object.prototype.toString.call(name) === '[object Array]')
    {
      var name_is_array = true;
      name = name[0];
    }
    var sbv = req.body.suggested_by_volunteer;
    var created_by = req.body.created_by;
    var newSkill = Skill(
    {
      name: name, 
      suggested_by_volunteer: sbv,
      created_by: created_by
    });
    newSkill.save(function (err) {
      if (err) {
        res.status(400);
        res.send('This skill already exists.');
      }
      else {
        if (name_is_array)
        {
          res.status(201).send('Only ' + name + ' has been created. Only one skill can be added at a time');
        }
        else res.sendStatus(201);  
      }
    })
  }
};
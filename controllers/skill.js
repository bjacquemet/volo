var Skill = require('../models/skill');

exports.list = function(req, res) {
  Skill.find({}).select('_id name').exec(function(err,skill) {
        res.send(skill);
      });
};

exports.new = function(req,res) {
  var name = req.body.name;
  if (Object.prototype.toString.call(name) === '[object Array]')
  {
    var name_is_array = true;
    name = name[0];
  }
  var newSkill = Skill(
  {
    name: name
  });
  newSkill.save(function (err) {
    if (err) throw err;
    else {
      if (name_is_array)
      {
        res.status(201).send('Only ' + name + ' has been created. Only one skill can be set at a time');
      }
      else res.sendStatus(201);
    }
  })
};
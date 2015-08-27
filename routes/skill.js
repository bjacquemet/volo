var express = require('express');
var router = express.Router();
var Skill = require('../models/skill');

function ensureAuthenticated(req, res, next) {
  if (req.user) { return next(); }
  res.sendStatus(401);
}

router.get("/list", ensureAuthenticated, function(req,res) {
    Skill.find({}).select('_id name').exec(function(err,skill) {
      res.send(skill);
    });
});

router.post("/new", ensureAuthenticated, function(req,res) {
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
});

module.exports = router;

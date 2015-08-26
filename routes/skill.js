var express = require('express');
var router = express.Router();
var Skill = require('../models/skill');
// var bodyParser = require('body-parser');
// router.use(bodyParser.json());
// router.use(bodyParser.urlencoded({ extended: false }));

router.get("/list", function(req,res) {
    Skill.find({},function(err,skill) {
      res.send(skill);
    });
});

router.post("/new", function(req,res) {
  console.log(req.body.name);
  var newSkill = Skill(
  {
    name: req.body.name
  });
  newSkill.save(function (err) {
    if (err) throw err;
    else res.sendStatus(201);
  })
});

module.exports = router;

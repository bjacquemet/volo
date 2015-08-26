var express = require('express');
var router = express.Router();
var Role = require('../models/role');

router.get("/list", function(req,res) {
    Role.find({},function(err,role) {
      res.send(role);
    });
});

router.post("/new", function(req,res) {
  console.log(req.body.name);
  var newRole = Role(
  {
    name: req.body.name
  });
  newRole.save(function (err) {
    if (err) throw err;
    else res.sendStatus(201);
  })
});

module.exports = router;

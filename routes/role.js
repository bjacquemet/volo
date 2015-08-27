var express = require('express');
var router = express.Router();
var Role = require('../models/role');

function ensureAuthenticated(req, res, next) {
  if (req.user) { return next(); }
  res.sendStatus(401);
}

router.get("/list", ensureAuthenticated, function(req,res) {
    Role.find({}).select('_id name').exec(function(err,role) {
      res.send(role);
    });
});

router.post("/new", ensureAuthenticated, function(req,res) {
  var name = req.body.name;
  if (Object.prototype.toString.call(name) === '[object Array]')
  {
    var name_is_array = true;
    name = name[0];
  }
  var newRole = Role(
  {
    name: name
  });
  newRole.save(function (err) {
    if (err) throw err;
    else {
      if (name_is_array)
      {
        res.status(201).send('Only ' + name + ' has been created. Only one role can be set at a time');
      }
      else res.sendStatus(201);
    }
  })
});

module.exports = router;

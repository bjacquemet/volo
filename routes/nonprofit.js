var express = require('express');
var router = express.Router();
var Nonprofit = require('../models/nonprofit');

router.get("/list", function(req,res) {
    Nonprofit.find({}).select('_id name suggested_by_volunteer').exec(function(err,nonprofit) {
      res.send(nonprofit);
    });
});

router.post("/new", function(req,res) {
  console.log(req.body);
  var name = req.body.name;
  var sbv = req.body.suggested_by_volunteer;
  // if (Object.prototype.toString.call(name) === '[object Array]')
  // {
  //   var name_is_array = true;
  //   name = name[0];
  // }
  var newNonprofit = Nonprofit(
  {
    name: name, 
    suggested_by_volunteer: sbv
  });
  newNonprofit.save(function (err) {
    if (err) throw err;
    else res.sendStatus(201);  
  })
});

module.exports = router;

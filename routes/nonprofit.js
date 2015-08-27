var express = require('express');
var router = express.Router();
var Nonprofit = require('../models/nonprofit');

router.get("/list", function(req,res) {
    Nonprofit.find({},function(err,nonprofit) {
      res.send(nonprofit);
    });
});

router.post("/new", function(req,res) {
  var name = req.body;
  console.log(req.body);
  // if (Object.prototype.toString.call(name) === '[object Array]')
  // {
  //   var name_is_array = true;
  //   name = name[0];
  // }
  // var newNonprofit = Nonprofit(
  // {
  //   name: name
  // });
  // newNonprofit.save(function (err) {
  //   if (err) throw err;
  //   else {
  //     if (name_is_array)
  //     {
  //       res.status(201).send('Only ' + name + ' has been created. Only one nonprofit can be set at a time');
  //     }
  //     else res.sendStatus(201);
  //   }
  // })
});

module.exports = router;

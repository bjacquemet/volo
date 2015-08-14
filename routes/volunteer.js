var express = require('express');
var router = express.Router();
var passport = require('passport');
var Volunteer = require('../models/volunteer');

function ensureAuthenticated(req, res, next) {
  if (req.user) { return next(); }
  res.redirect('../login')
}

router.get('/', ensureAuthenticated, function(req, res, next) {
  Volunteer.findOne({account_id: req.user._id}, function (err, results) {
    if (err) throw err;
    res.render('volunteer/profile', { title: 'Volunteer private profile', user: req.user, volunteer: results });
  });
});

router.post('/new', function(req, res){
  var newVolunteer = Volunteer({
    account_id: req.user._id,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.user.email,
    gender: req.body.gender
  })

  newVolunteer.save(function(err) {
    if(err) throw err;
    console.log('Volunteer created');
    res.redirect('/volunteer/');
  });
});

router.post('/update', function (req, res) {
  var fields = ['first_name', 'last_name', 'gender'];
  var field = req.body.pk;
  var value = req.body.value;
  if (fields.indexOf(field) > -1)
  {
    Volunteer.findOne({account_id: req.user._id}, function(err, volunteer){
    switch (field)
    {
      case 'first_name':
        volunteer.first_name = value;
        console.log('updating');
        break;
      case 'last_name':
        volunteer.larst_name = value;
        break;
      case 'gender':
        volunteer.gender = value;
        break;
    }

    volunteer.save(function(err) {
      if (err) throw err;
      console.log(field + ' successfully updated with ' + value);
      res.sendStatus(200);
    })
  });
  } 
  else {
    res.end("Field doesn't exist");
  }
})

module.exports = router;

var express = require('express');
var router = express.Router();
var passport = require('passport');
var Volunteer = require('../models/volunteer');

function ensureAuthenticated(req, res, next) {
  if (req.user) { return next(); }
  res.redirect('../login')
}

router.get('/', ensureAuthenticated, function(req, res, next) {
  Volunteer.findOne({account_id: req.user._id}, function (err, result) {
    if (err) {
      throw err;
      // res.redirect('/');
    }
    res.render('volunteer/profile', { title: 'Volunteer private profile', user: req.user, volunteer: result });
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
  var fields = ['first_name', 'last_name', 'gender', 'birthdate'];
  var field = req.body.pk;
  console.log(field);
  var value = req.body.value;
  if (fields.indexOf(field) > -1)
  {
    Volunteer.findOne({account_id: req.user._id}, function(err, volunteer){
    switch (field)
    {
      case 'first_name':
        volunteer.first_name = value;
        break;
      case 'last_name':
        volunteer.last_name = value;
        break;
      case 'gender':
        volunteer.gender = value;
        break;
      case 'birthdate':
        volunteer.birthdate = value;
        break;
    }
    volunteer.save(function(err, volunteer) {
      if (err) {
         throw err;
         return console.log(err);
      }
      else {
        console.log('Successfully updated: ' + volunteer);
        res.sendStatus(200);
      }
    })
  });
  } 
  else {
    console.log("Field doesn't exist");
    res.sendStatus(303);
    // res.end("Field doesn't exist");
  }
})

module.exports = router;

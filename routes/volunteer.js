var express = require('express');
var router = express.Router();
var passport = require('passport');
var Volunteer = require('../models/volunteer');

function ensureAuthenticated(req, res, next) {
  if (req.user) { return next(); }
  res.redirect('../login')
}

router.post('/photo', function(req,res) {
  if(typeof(req.files.userPhoto.path) != 'undefined') {
    console.log(req.files);
    Volunteer.findOne({account_id: req.user._id}, function(err, volunteer){
      var photo_url = req.files.userPhoto.path.substring(6);
      var json = {photo: photo_url};
      volunteer.update(json, { upsert : true }, function(err) {
        if (err) {
           throw err;
           return console.log(err);
        }
        else {
          console.log('Successfully updated: ' + volunteer);
          res.end(req.files.userPhoto.path);
        }
      })
    });
  }
  else
    {
      console.log("error");
      console.log(req.files);
    }
});

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
  var fields = ['first_name', 'last_name', 'gender', 'birthdate', "email", "phone", "position", "home_address", "about"];
  var field = req.body.pk;
  console.log(field);
  var value = req.body.value;
  var json;
  if (fields.indexOf(field) > -1)
  {
    Volunteer.findOne({account_id: req.user._id}, function(err, volunteer){
    switch (field)
    {
      case 'first_name':
        json = {first_name: value};
        break;
      case 'last_name':
        json = {last_name: value};
        break;
      case 'gender':
        json = {gender: value};
        break;
      case 'birthdate':
        json = {birthdate: value};
        break;
      case 'email':
        json = {email: value};
        break;
      case 'phone':
        json = {phone: value};
        break;
      case 'position':
        json = {position: value};
        break;
      case 'home_address':
        json = {home_address: value};
        break;
      case 'about':
        json = {about: value};
        break;
      default:
        break;
    }
    volunteer.update(json, { upsert : true }, function(err) {
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
    res.send({status: "error", msg: "Field doesn't exist"});
    // res.end("Field doesn't exist");
  }
})

module.exports = router;

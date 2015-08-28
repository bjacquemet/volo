var express = require('express');
var router = express.Router();
var passport = require('passport');
var Volunteer = require('../models/volunteer');
var Activity = require('../models/activity');
var Experience = require('../models/experience');
var fs = require('fs');
var http = require('http');

function ensureAuthenticated(req, res, next) {
  if (req.user) { return next(); }
  res.redirect('../login')
}

router.get("/photo/:email", function(req,res) {
    Volunteer.findOne({ email: req.params.email },function(err,volunteer) {
      res.set("Content-Type", volunteer.photo.contentType);
      res.send(volunteer.photo.data );
    });
});

router.post('/photo', function(req,res) {
  if(typeof(req.files.userPhoto.path) != 'undefined') {
    console.log(req.files);
    Volunteer.findOne({account_id: req.user._id}, function(err, volunteer){
      var json = {photo: {data: fs.readFileSync(req.files.userPhoto.path), contentType: req.files.userPhoto.mimetype, path: req.files.userPhoto.path.substring(6)}};
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

router.get('/edit', ensureAuthenticated, function(req, res, next) {
  Volunteer.findOne({account_id: req.user._id}).exec(function (err, volunteer) {
    if (err || !volunteer) {
      console.log(err);
    }
    else {
      var options = {
        host: process.env.HOST || "localhost:3000",
        // port: process.env.PORT || 3000,
        path: '/experience/volunteer/' + volunteer._id
      };
      http.get(options, function(response){
        var jsonObject = '';
        response.on('data', function (d){
          jsonObject += d;
        });
        response.on('end', function (){
          var experiences = JSON.parse(jsonObject);
          res.render('volunteer/profile', { title: 'Volunteer private profile', user: req.user, volunteer: volunteer, experiences: experiences});
        });
      });

      // Experience.find({volunteer: volunteer._id}).populate('activities nonprofit').exec(function (err, experiences) {
      //   if (err) {
      //     console.log(err);
      //   }   
      //   else {
      //     // populate role
      //     Experience.populate(experiences, {
      //         path: 'activities.role',
      //         model: 'Role'
      //       }, 
      //       function (err, experiences_role) {
      //         if (err) console.log(err);
      //         else
      //         {
      //           // populate skills
      //           Experience.populate(experiences_role, {
      //             path: 'activities.skills',
      //             model: "Skill"
      //           }, function(err, experiences_role_skills) {
      //             if (err) console.log(err);
      //             else
      //             {
      //               res.render('volunteer/profile', { title: 'Volunteer private profile', user: req.user, volunteer: volunteer, experiences: experiences_role_skills });
      //             }
      //           })
      //         }
      //       });
      // }
      // });
    }
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
  var fields = ['first_name', 'last_name', 'gender', 'birthdate', "email", "phone", "position", "postcode", "about", "university", "discipline","company", "graduation_year", "graduate"];
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
      case 'postcode':
        json = {postcode: value};
        break;
      case 'about':
        json = {about: value};
        break;
      case 'university':
        json = {university: value};
        break;
      case 'company':
        json = {company: value};
        break;
      case 'graduate':
        json = {graduate: value};
        break;
      case 'graduation_year':
        json = {graduation_year: value};
        break;
      case 'discipline':
        json = {discipline: value};
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

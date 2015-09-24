var Volunteer = require('../models/volunteer');
var Experience = require('../models/experience');
var Skill = require('../models/skill');
var ExperienceController = require('./experience');
var ActivityController = require('./activity');
var RecommendationController = require('../controllers/recommendation');
var fs = require('fs');
var sys = require('sys')
var exec = require('child_process').exec;
function puts(error, stdout, stderr) { sys.puts(stdout) }

function getProfileByAccountId (volunteer_account_id, callback) {
  Volunteer.findOne({account_id: volunteer_account_id}).exec(function (err, volunteer) {
      if (err || !volunteer) {
        console.log(err);
      }
      else {
        ExperienceController.getByVolunteerId(volunteer._id, function(response) {
          callback({
            experiences: response.experiences,
            volunteer: volunteer
          });
        });
      }
    });
};

function getProfileById (volunteer_id, callback) {
  Volunteer.findById(volunteer_id, function (err, volunteer) {
      if (err || !volunteer) {
        console.log(err);
      }
      else {
        ExperienceController.getByVolunteerId(volunteer._id, function(response) {
          callback({
            experiences: response.experiences,
            volunteer: volunteer
          });
        });
      }
    });
};

exports.list = function(req, res) {
  Volunteer.find({}).limit(3).exec(function(err, volunteers) {
    res.send(volunteers);
  });
};

exports.getPhotoByVolunteerId = function(req,res) {
    Volunteer.findOne({ _id: req.params.id },function(err,volunteer) {
      res.set("Content-Type", volunteer.photo.contentType);
      if (volunteer.photo.cropedPath) res.send(fs.readFileSync(volunteer.photo.cropedPath));
      else {
        res.send(fs.readFileSync(volunteer.photo.originalPath));
      }
      // res.send(volunteer.photo.data);
    });
};

exports.postPhoto = function(req,res) {
  if(typeof(req.files.userPhoto.path) != 'undefined') {
    console.log(req.files);
    exec("node node_modules/quickthumb/bin/make-thumb.js " + req.files.userPhoto.path + ' ' + 'public/crop/' + ' 400x400', puts);
    Volunteer.findOne({_id: req.user._id}, function(err, volunteer){
      var json = {photo: {contentType: req.files.userPhoto.mimetype, cropedPath:'public/crop/'+req.files.userPhoto.name, originalPath: req.files.userPhoto.path, name: req.files.userPhoto.name}};
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
      res.send(400);
    }
};

exports.getEditProfile = function(req, res, next) {
  getProfileById(req.user._id, function (complete_profile){
    var volunteer = complete_profile.volunteer;
    var experiences = complete_profile.experiences;
    ActivityController.getVolunteerSkills(volunteer._id, function (err, skills) {
      if (err) console.log(err);
      else 
      {
        RecommendationController.getRecofromVolunteerId(volunteer._id, function (err, reco) {
          console.log(skills);
          console.log(reco);
          res.render('volunteer/editProfile', { title: 'Volunteer private profile', 
          user: req.user, 
          volunteer: volunteer, 
          experiences: experiences,
          volunteer_skills: skills,
          recommendations: reco });
        });
      }
    });
  });
};

exports.getProfile = function (req, res, next) {
  getProfileById(req.params.id, function (complete_profile){
    var volunteer = complete_profile.volunteer;
    var experiences = complete_profile.experiences;
    console.log(complete_profile.experiences);
    ActivityController.getVolunteerSkills(req.params.id, function (err, skills) {
      if (err) console.log(err);
      else {
        RecommendationController.getRecofromVolunteerId(req.params.id, function (err, reco) {
          res.render('volunteer/profile', { title: volunteer.first_name + ' ' + volunteer.last_name + '\'s VOLO profile', 
            user: req.user, 
            volunteer: volunteer, 
            experiences: experiences,
            volunteer_skills: skills,
            recommendations: reco });
        })
      }
    });
  });
}

exports.searchProfile = function (req, res) { 
  if (req.query.search) {
    var terms = req.query.search.split(' ');
    var regexString = "";
    for (var i = 0; i < terms.length; i++)
    {
        regexString += terms[i];
        if (i < terms.length - 1) regexString += '|';
    }
    var re = new RegExp(regexString, 'ig');
    Volunteer.aggregate([
      {$project:
      {
        fullname: {$concat: ['$first_name', ' ', '$last_name']},
        first_name: 1,
        last_name: 1,
        position:1,
        university:1,
        company:1
      },
       },
       {$match:
        {fullname: re}}
      ],
      function (err, results) {
        if (err) console.log(err);
        console.log("results");
        console.log(results);
        var volunteer_profiles = [],
            profil = {},
            result_length = results.length,
            i =0;
        console.log("result_length =" + result_length);
        if (result_length == 0) {
            res.render('volunteer/search', {title: "Volunteer Results for search " + req.query.search, 
            user: req.user,
            results: null
          })
        }
        results.forEach(function (volunteer) {
          ActivityController.getVolunteerSkills(volunteer._id, function (err, skills) {
            if (err) console.log(err);
            profil = {_id: volunteer._id, first_name: volunteer.first_name, last_name: volunteer.last_name, position:volunteer.position};
            if (volunteer.university) profil['university'] = volunteer.university;
            if (volunteer.company) profil['company'] = volunteer.company;
            console.log(skills);
            if (skills)
            {
              profil.skills = skills.skills;
            }
            volunteer_profiles.push(profil);
            i++;
            if (result_length == i) {
                res.render('volunteer/search', {title: "Volunteer Results for search " + req.query.search, 
                user: req.user,
                results: volunteer_profiles
              });
            }
          });
        })
      }
    )
  }
  else
  {
    res.render('volunteer/search', {title: "Volunteer Results for search " + req.query.search, 
      user: req.user
    });
  }
}

exports.updateProfile = function (req, res) {
  var fields = ['first_name', 'last_name', 'gender', 'birthdate', "email", "phone", "position", "postcode", "about", "university", "discipline","company", "graduation_year", "graduate"];
  var field = req.body.name;
  var value = req.body.value;
  var json;
  if (fields.indexOf(field) > -1)
  {
    Volunteer.findOne({_id: req.body.pk}, function(err, volunteer){
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
    if (field == 'email') {
      Volunteer.findByIdAndUpdate(req.user._id, {email: value}, function (err, volunteer) {
        if (err) {
          console.log(err);
          res.status(400);
          res.send('Sorry, this email is already taken.');
        }
        else {
          console.log('Successfully updated: ' + volunteer);
          res.sendStatus(200);
        }
      })
    }
    else
    {
      volunteer.update(json, { upsert : true }, function(err) {
        if (err) {
           res.send({status: 400, msg: err});
        }
        else {
          console.log('Successfully updated: ' + volunteer);
          res.sendStatus(200);
        }
      })
    }
  });
  } 
  else {
    console.log("Field doesn't exist");
    res.status(400)
    res.send("Field doesn't exist");
    // res.end("Field doesn't exist");
  }
};

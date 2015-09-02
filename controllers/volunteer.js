var Volunteer = require('../models/volunteer');
var Experience = require('../models/experience');
var Skill = require('../models/skill');
var ExperienceController = require('./experience');
var ActivityController = require('./activity');
var fs = require('fs');

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
      res.send(volunteer.photo.data);
    });
};

exports.postPhoto = function(req,res) {
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
};

exports.getEditProfile = function(req, res, next) {
  getProfileByAccountId(req.user._id, function (complete_profile){
    var volunteer = complete_profile.volunteer;
    var experiences = complete_profile.experiences;
    ActivityController.getVolunteerSkills(volunteer._id, function (skills) {
      console.log(skills);
      res.render('volunteer/editProfile', { title: 'Volunteer private profile', 
      user: req.user, 
      volunteer: volunteer, 
      experiences: experiences,
      volunteer_skills: skills });
    });
  });
};

exports.getProfile = function (req, res, next) {
  getProfileById(req.params.id, function (complete_profile){
    var volunteer = complete_profile.volunteer;
    var experiences = complete_profile.experiences;
    ActivityController.getVolunteerSkills(req.params.id, function (skills) {
      console.log(skills);
      res.render('volunteer/profile', { title: 'Volunteer profile of ' + volunteer.first_name + ' ' + volunteer.last_name, 
        user: req.user, 
        volunteer: volunteer, 
        experiences: experiences,
        volunteer_skills: skills });
    });
  });
}

exports.searchProfile = function (req, res) {
  var searchTerm = req.query.search;
  searchTerm = searchTerm.toString();
  console.log(searchTerm);
  Volunteer.search({
    query_string: {
      query: searchTerm
    },
  }, {hydrate:true},
  function (err, search_result) {
      if (err) console.log(err);
      else {
        var volunteer_profiles = [];
        var profil = {};
        var result_length = search_result.hits.hits.length,
            i =0;
        search_result.hits.hits.forEach(function(hit) {
          ActivityController.getVolunteerSkills(hit._id, function (skills) {
            if (err) {
              console.log(err);
            }
            else {
              profil = {first_name: hit.first_name, last_name: hit.last_name, position:hit.position};
              if (hit.university) profil['university'] = hit.university;
              if (hit.company) profil['company'] = hit.company;
              profil.skills = skills.skills;
              volunteer_profiles.push(profil);
              i++;
              if (result_length == i) {
                  res.render('volunteer/search', {title: "Volunteer Results for search " + searchTerm, 
                  user: req.user,
                  results: volunteer_profiles
                });
              }
            }
          })
        });
        // res.render('/volunteer/results', {title: "Volunteer Results for search " + searchTerm, 
          // user: req.user,
          // results: volunteer_profiles
        // });
        // Volunteer.populate(result, {path: "_id", select: "first_name"}, function (err, results){
        //   if (err) console.log(err);
        //   else
        //   {
        //     // console.log(results);
        //     res.render('/volunteer/results', {title: "Volunteer Results for search " + searchTerm, 
        //       user: req.user,
        //       results: results
        //     });
        //   }
        // })
      }
    }
  );
};

exports.newProfile = function(req, res){
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
    res.redirect('/volunteer/edit');
  });
};


exports.updateProfile = function (req, res) {
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
};

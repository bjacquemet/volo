var Volunteer = require('../models/volunteer');
var Experience = require('../models/experience');
var Skill = require('../models/skill');
var ExperienceController = require('./experience');
var ActivityController = require('./activity');
var RecommendationController = require('../controllers/recommendation');
var path = require('path');
var qt = require('quickthumb');
var aws = require('aws-sdk');
var fs = require('fs');
var sys = require('sys')
var exec = require('child_process').exec;
function puts(error, stdout, stderr) { sys.puts(stdout) }

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
  // Volunteer.find({"photo.name": {$ne: 'placeholder.png'}}).select('first_name last_name photo').limit(16).exec(function (err, volunteers) {
  //   res.send(volunteers);
  // })
  Volunteer.findRandom({"photo.name": {$ne: 'placeholder.png'}}, 
                        {first_name:1, last_name:1, photo:1}, 
                        {limit:16}, function (err, volunteers) {
                          res.send(volunteers);
  });
};

exports.getPhotoByVolunteerId = function(req,res) {
    Volunteer.findOne({ _id: req.params.id },function(err,volunteer) {
      var s3 = new aws.S3({signatureVersion: 'v4',region: 'eu-central-1'});
      var params = {
          Bucket: 'volo-crop-image',
          Key: volunteer.photo.name
        };
      res.set("Content-Type", volunteer.photo.contentType);
      console.log(volunteer.photo);
      // res.send(fs.readFileSync('public/images/placeholder.png'));
      if (volunteer.photo.cropedPath) {
        console.log('croped');
        s3.getObject(params, function (err, data) {
          if (err) {
            res.sendStatus(401)
            console.log(err);
          }
          else {
            console.log(data);
            res.send(data.Body);
          }
        })
      }
      else {
        res.send(fs.readFileSync(volunteer.photo.originalPath));
      }
      // res.send(volunteer.photo.data);
    });
};

function putPhototoS3 (file, callback) {
  console.log(file);
  console.log(process.env.AWS_ACCESS_KEY_ID);
  aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, 
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  });
  var s3 = new aws.S3({signatureVersion: 'v4',region: 'eu-central-1'});
  var s3_params = {
      Bucket: 'volo-crop-image',
      Key: file.name,
      Expires: 60,
      ContentType: file.mimetype,
      ACL: 'public-read', 
      CacheControl: 'max-age=31536000',
      Body: new Buffer(fs.readFileSync(file.croped_image))
  };
  var url = s3.putObject(s3_params, function (err, data) {
    if (err) {
      console.log(err);
      callback(err, null);
    }
    else {
      console.log("data");
      console.log(data);
      callback(null, data);
    }
  });
}

exports.postPhoto = function(req,res) {
  if(typeof(req.files.userPhoto.path) != 'undefined') {
    console.log('entering');
    console.log(req.files);
    var options = {
      src: req.files.userPhoto.path,
      dst: path.resolve(__dirname, '../public/crop/')+'/'+req.files.userPhoto.name,
      width: 400,
      height: 400
    }
    qt.convert(options, function (err, croped_image) {
      if (err) console.log(err);
      else {
        console.log(croped_image);
        var croped_file = {
          name: req.files.userPhoto.name,
          mimetype: req.files.userPhoto.mimetype,
          croped_image: croped_image
        };
        putPhototoS3(croped_file, function (err, data) {
          if (err) console.log(err);
          else {
            console.log(data);
            var aws_url = process.env.AWS_URL ||'https://s3.eu-central-1.amazonaws.com/volo-crop-image/'
            aws_url += croped_file.name;
            Volunteer.findOne({_id: req.user._id}, function(err, volunteer){
              var json = {photo: {contentType: req.files.userPhoto.mimetype, cropedPath:aws_url, originalPath: req.files.userPhoto.path, name: req.files.userPhoto.name}};
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
        })
      }
    })
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
        company:1,
        photo:1
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
            profil = {_id: volunteer._id, first_name: volunteer.first_name, last_name: volunteer.last_name, position:volunteer.position, photo:volunteer.photo};
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

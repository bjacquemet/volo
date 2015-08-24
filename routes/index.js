var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var Volunteer = require('../models/volunteer');
var router = express.Router();
var moment = require('moment');

function ensureAuthenticated(req, res, next) {
  if (req.user) { return next(); }
  res.redirect('/login')
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home', user: req.user });
});

// REGISTER
router.get('/register', function(req, res) {
    res.render('register', { });
});

router.post('/register', function(req, res) {
    Account.register(new Account(
      { 
        username : req.body.username, 
        email: req.body.email, 
        usertype : req.body.usertype 
      }), 
      req.body.password, function(err, account) {
        if (err) {
          return res.render("register", {info: err});
        }
        passport.authenticate('local')(req, res, function () {
          // If volunteer, create volunteer account
          if (req.body.usertype == "volunteer") {
            var newVolunteer = Volunteer({
              account_id: req.user._id,
              first_name: req.body.first_name,
              last_name: req.body.last_name,
              email: req.body.email
            });
            newVolunteer.save(function(err) {
              if(err) throw err;
              console.log('Volunteer created');
              res.redirect('/volunteer/');
            });
          }
          else res.redirect('/');
        });
    });
});

// LOG IN
router.get('/login', function(req, res) {
    res.render('login', { user : req.user, info: req.flash('error') });
});
router.post('/login', passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: true }));

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

// Forgot password
router.get('/forgot', function(req, res) {
  res.render('forgot', {user: req.user})
});


// volunteer private profile
router.get('/profile', function(req, res, next) {
  res.render('profile', { title: 'Volunteer private profile', user: req.user });
});

// volunteer public profile
router.get('/v_profile', function(req, res, next) {
  res.render('volunteer_profile', { title: 'Volunteers', user: req.user });
});

// nonprofit public profile
router.get('/n_profile', function(req, res, next) {
  res.render('nonprofit_profile', { title: 'Nonprofit public profile', user: req.user });
});

// corporate public profile
router.get('/c_profile', function(req, res, next) {
  res.render('corporate_profile', { title: 'Company public profile', user: req.user });
});

// corporate private profile
router.get('/c_profile_private', function(req, res, next) {
  res.render('corporate_private_profile', { title: 'Company private profile', user: req.user });
});

// university public profile
router.get('/u_profile', function(req, res, next) {
  res.render('university_profile', { title: 'University public profile', user: req.user });
});

// volunteers page
router.get('/volunteers', function(req, res, next) {
  res.render('volunteers', { title: 'Volunteer public profile', user: req.user });
});

// volunteers page
router.get('/volunteer_result', function(req, res, next) {
  res.render('volunteer_result', { title: 'Volunteer result list', user: req.user });
});

// nonprofits page
router.get('/nonprofits', function(req, res, next) {
  res.render('nonprofits', { title: 'Nonprofits', user: req.user });
});

// corporates page
router.get('/corporates', function(req, res, next) {
  res.render('corporates', { title: 'Company public profile', user: req.user });
});

// universities page
router.get('/universities', function(req, res, next) {
  res.render('universities', { title: 'Company public profile', user: req.user });
});


router.get('/profiles', function(req, res, next) {
  var volunteers = Volunteer.find({}, function(err, results)
    {
      res.render('profiles', { title: 'Profile', volunteers: results, user: req.user});
    });
});

module.exports = router;

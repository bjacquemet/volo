var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();

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
          return res.render("register", {info: "Sorry. That username already exists. Try again."});
        }
        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
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

// volunteers page
router.get('/volunteers', function(req, res, next) {
  res.render('volunteers', { title: 'Volunteer public profile', user: req.user });
});

// nonprofits page
router.get('/nonprofits', function(req, res, next) {
  res.render('nonprofits', { title: 'Nonprofits', user: req.user });
});

// corporates page
router.get('/corporates', function(req, res, next) {
  res.render('corporates', { title: 'Company public profile', user: req.user });
});

router.get('/profiles', function(req, res, next) {
  var profiles = Account.find({}, function(err, results)
    {
      res.render('profiles', { title: 'Company public profile', profiles: results});
    });
});

module.exports = router;

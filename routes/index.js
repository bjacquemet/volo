var express = require('express');
var router = express.Router();
var IndexController = require('../controllers/index');


function ensureAuthenticated(req, res, next) {
  if (req.user) { return next(); }
  res.redirect('/login')
}

router.post('/register', IndexController.register);
router.post('/login', IndexController.login);
router.post('/forgot', IndexController.forgot);
router.post('/forgot_username', IndexController.forgot_username);
router.post('/reset/:token', IndexController.updatePassword);

router.get('/', function(req, res, next) {
  res.header('Cache-Control', 'public, max-age=31557600');
  res.render('index', { title: 'Home', user: req.user });
});

router.get('/register', function(req, res) {
  res.header('Cache-Control', 'public, max-age=31557600');
  res.render('register', {title: "Register"});
});

router.get('/login', function(req, res) {
  res.header('Cache-Control', 'public, max-age=31557600');
  res.render('login', { user : req.user, info: req.flash('error'), title: "Login" });
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/reset/:token', IndexController.resetPasswordView);

router.get('/forgot', function(req, res) {
  res.render('forgot', {title: "Forgot your password?", user: req.user})
});

router.get('/forgot_username', function(req, res) {
  res.render('forgot_username', {title: "Forgot your username?", user: req.user})
});

// nonprofits page
router.get('/nonprofits', function(req, res, next) {
  res.header('Cache-Control', 'public, max-age=31557600');
  res.render('nonprofits', { title: 'Nonprofits', user: req.user });
});

// corporates page
router.get('/corporates', function(req, res, next) {
  res.header('Cache-Control', 'public, max-age=31557600');
  res.render('corporates', { title: 'Company public profile', user: req.user });
});

// universities page
router.get('/universities', function(req, res, next) {
  res.header('Cache-Control', 'public, max-age=31557600');
  res.render('universities', { title: 'Company public profile', user: req.user });
});

// volunteers page
router.get('/students', function(req, res, next) {
  res.header('Cache-Control', 'public, max-age=31557600');
  res.render('students', { title: 'Volunteer public profile', user: req.user });
});

///////////////////////////////////////////////////////////
///////////// Static pages for wireframing ///////////////
/////////////////////////////////////////////////////////

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

// volunteer result page
router.get('/volunteer_result', function(req, res, next) {
  res.render('volunteer_result', { title: 'Volunteer result list', user: req.user });
});

// university volunteering tracking
router.get('/u_tracking', function(req, res, next) {
  res.render('university_tracking', { title: 'Student volunteering hours', user: req.user });
});

// nonprofit volunteering validation
router.get('/n_validation', function(req, res, next) {
  res.render('nonprofit_validation', { title: 'Volunteering Experience Validation', user: req.user });
});

module.exports = router;

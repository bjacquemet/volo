var passport = require('passport');
var Account = require('../models/account');
var Volunteer = require('../models/volunteer');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var fs = require('fs');

exports.register = function(req, res) {
    if (req.body.usertype != 'volunteer')
    {
      var usertype = ['volunteer', req.body.usertype];
    }
    else var usertype = ['volunteer']; 
    Account.register(new Account(
      { 
        username : req.body.username, 
        email: req.body.email, 
        usertype : usertype
      }), 
      req.body.password, function(err, account) {
        if (err) {
          return res.render("register", {info: err});
        }
        passport.authenticate('local')(req, res, function () {
          // If volunteer, create volunteer account
            var newVolunteer = Volunteer({
              account_id: account._id,
              first_name: req.body.first_name,
              last_name: req.body.last_name,
              photo: {contentType: 'image/png', originalPath: 'public/images/placeholder.png', cropedPath: 'public/images/placeholder.png',  name: 'placeholder.png'},
              email: req.body.email
            });
            newVolunteer.save(function(err) {
              if(err) throw err;
              console.log('Volunteer created');
              if (req.body.usertype == "volunteer") res.redirect('/volunteer/edit');
              else if (req.body.usertype == "corporate") res.redirect('/corporates');
              else if (req.body.usertype == "nonprofit") res.redirect('/nonprofits');
              else if (req.body.usertype == "university") res.redirect('/universities');
              else res.redirect('/');
            });
        });
    });
};

exports.login = function (req, res) 
  {
    passport.authenticate('local', 
    { failureRedirect: '/login',
      failureFlash: true 
    })(req, res, function () {
      Account.findOneAndUpdate({username: req.user.username}, {last_sign_in: Date.now()}, {upsert: true, 'new': true}, function(err, account){
        if (err) console.log(err);
        else res.redirect('/volunteer/edit');
      });
  });
}

exports.forgot_username = function (req, res, next) {
  async.waterfall([
    function (done) {
      Account.findOne({email: req.body.email}, function (err, user) {
        if (!user) {
          req.flash('error', 'No account with this email ('+ req.body.email +') address exists.');
          return res.redirect('/forgot_username');
        }
        done(err, user);
      })
    },
    function(user, done) {
      console.log(user);
      var smtpTransport = nodemailer.createTransport({
        host: 'smtp.mailgun.org',
        service: "Mailgun",
        auth: {
          user: "postmaster@mg.volo.org.uk",
          pass: "18682498971f9e94b4c22b6433284351"
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'VOLO <password@volo.org.uk>',
        subject: "VOLO: Here is your username",
        text: 'Your are receiving this email because you have requested to receive your username.' + '\n\n' +
          'Here is your username : ' + user.username,
        html: 'Your are receiving this email because you have requested to receive your username.' + '\n\n' +
          'Here is your username : <b>' + user.username +'</b>'

      };
      smtpTransport.sendMail(mailOptions, function (err) {
        req.flash('info', 'An email has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      })
    }
  ], function (err) {
    if (err) return next(err);
    res.redirect('/forgot_username');
  });
}

exports.forgot = function (req, res, next) {
  async.waterfall([
    function (done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function (token, done) {
      Account.findOne({email: req.body.email}, function (err, user) {
        if (!user) {
          req.flash('error', 'No account with this email ('+ req.body.email +') address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // (1 hour from now)

        user.save(function (err) {
          done(err, token, user);
        })
      })
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        host: 'smtp.mailgun.org',
        service: "Mailgun",
        auth: {
          user: "postmaster@mg.volo.org.uk",
          pass: "18682498971f9e94b4c22b6433284351"
        }
      });

      var mailOptions = {
        to: user.email,
        from: 'VOLO <password@volo.org.uk>',
        subject: "Reset your password",
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function (err) {
        req.flash('info', 'An email has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      })
    }
  ], function (err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
}

exports.resetPasswordView = function (req, res) {
  Account.findOne({
    resetPasswordToken: req.params.token, 
    resetPasswordExpires: { $gt: Date.now() }
  }, function (err, user) {
    if (!user) {
      req.flash('error', 'Password reset is invalid or has expired');
      return res.redirect('/forgot');
    }
    res.render('reset', {
      user: req.user
    });
  })
}

exports.updatePassword = function (req, res) {
  async.waterfall([
    function (done) {
      Account.findOne({
          resetPasswordToken: req.params.token, 
          resetPasswordExpires: { $gt: Date.now() }
        }, function (err, user) {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }


          user.setPassword(req.body.password, function (err, user){
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function (err) {
              req.logIn(user, function (err) {
                done(err, user);
              })
            });
          });
        });
    },
    function (user, done) {
      var smtpTransport = nodemailer.createTransport({
        host: 'smtp.mailgun.org',
        service: "Mailgun",
        auth: {
          user: "postmaster@mg.volo.org.uk",
          pass: "18682498971f9e94b4c22b6433284351"
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'VOLO <password@volo.org.uk>',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function (err) {
        req.flash('success', 'Success! Your password has been changed');
        done(err);
      });
    }
  ], function (err) {
    res.redirect('/');
  });
}
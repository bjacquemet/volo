var passport = require('passport');
var Account = require('../models/account');
var Volunteer = require('../models/volunteer');
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
              photo: {data: fs.readFileSync('./public/images/placeholder.png'), contentType: 'image/png', path: 'images/placeholder.png'},
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

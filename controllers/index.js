var passport = require('passport');
var Volunteer = require('../models/volunteer');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var fs = require('fs');
var emailTemplates = require('email-templates');
var path = require('path');
var templatesDir = path.resolve(__dirname, '../templates', 'emails');
var config = require('../config');

exports.register = function (req, res) {
    if (req.body.usertype != 'volunteer') {
        var usertype = ['volunteer', req.body.usertype];
    }
    else var usertype = ['volunteer'];
    var json_volunteer = {
        username: req.body.username,
        email: req.body.email,
        usertype: usertype,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        photo: {
            contentType: 'image/png',
            originalPath: '/images/placeholder.png',
            name: 'placeholder.png'
        }
    };
    Volunteer.register(new Volunteer(json_volunteer),
        req.body.password, function (err, volunteer) {
            if (err) {
                return res.render("register", {info: err});
            }
            passport.authenticate('local')(req, res, function () {
                console.log('Volunteer created');
                welcome(json_volunteer, function () {
                });
                res.redirect('/volunteer/edit');
            });
        }
    );
};

function welcome(volunteer, callback) {
    var smtpTransport = nodemailer.createTransport({
        host: config.email.host,
        service: config.email.service,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
        // host: '127.0.0.1',
        // port: 1025
    });

    locals = {
        email: volunteer.email,
        name: volunteer.first_name,
        url: config.url + '/login'
    };
    // to do change url
    emailTemplates(templatesDir, function (err, template) {
        if (err) {
            console.log(err);
        }
        else {
            template('welcome', locals, function (err, html, text) {
                if (err) {
                    console.log(err);
                } else {
                    smtpTransport.sendMail({
                        from: 'VOLO <melissa@volo.org.uk>',
                        bcc: "volo4change@gmail.com",
                        to: locals.name + "<" + locals.email + ">",
                        subject: 'Welcome to VOLO',
                        html: html,
                        text: text
                    }, function (err, responseStatus) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            callback();
                        }
                    });
                }
            });
        }
    })
}

exports.login = function (req, res) {
    passport.authenticate('local',
        {
            failureRedirect: '/login',
            failureFlash: true
        })(req, res, function () {
        Volunteer.findOneAndUpdate({username: req.user.username}, {last_sign_in: Date.now()}, {
            upsert: true,
            'new': true
        }, function (err, volunteer) {
            if (err) console.log(err);
            else res.redirect('/volunteer/edit');
        });
    });
}

exports.forgot_username = function (req, res, next) {
    async.waterfall([
        function (done) {
            Volunteer.findOne({email: req.body.email}, function (err, user) {
                if (!user) {
                    req.flash('error', 'No account with this email (' + req.body.email + ') address exists.');
                    return res.redirect('/forgot_username');
                }
                done(err, user);
            })
        },
        function (user, done) {
            console.log(user);
            var smtpTransport = nodemailer.createTransport({
                host: config.email.host,
                service: config.email.service,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });
            var mailOptions = {
                to: user.email,
                bcc: "volo4change@gmail.com",
                from: 'VOLO <no-reply@volo.org.uk>',
                subject: "VOLO: Here is your username",
                text: 'Your are receiving this email because you have requested to receive your username.' + '\n\n' +
                'Here is your username : ' + user.username,
                html: 'Your are receiving this email because you have requested to receive your username.' + '\n\n' +
                'Here is your username : <b>' + user.username + '</b>'

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
            crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function (token, done) {
            Volunteer.findOne({email: req.body.email}, function (err, user) {
                if (!user) {
                    req.flash('error', 'No account with this email (' + req.body.email + ') address exists.');
                    return res.redirect('/forgot');
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // (1 hour from now)

                user.save(function (err) {
                    done(err, token, user);
                })
            })
        },
        function (token, user, done) {
            var smtpTransport = nodemailer.createTransport({
                host: config.email.host,
                service: config.email.service,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            var mailOptions = {
                to: user.email,
                bcc: "volo4change@gmail.com",
                from: 'VOLO <no-reply@volo.org.uk>',
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
    Volunteer.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {$gt: Date.now()}
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
            Volunteer.findOne({
                resetPasswordToken: req.params.token,
                resetPasswordExpires: {$gt: Date.now()}
            }, function (err, user) {
                if (!user) {
                    req.flash('error', 'Password reset token is invalid or has expired.');
                    return res.redirect('back');
                }
                user.setPassword(req.body.password, function (err, user) {
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
                host: config.email.host,
                service: config.email.service,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });
            var mailOptions = {
                to: user.email,
                bcc: "volo4change@gmail.com",
                from: 'VOLO <no-reply@volo.org.uk>',
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

var Skill = require('../models/skill');
var Volunteer = require('../models/volunteer');
var nodemailer = require('nodemailer');
var config = require('../config');


function lowerToCapitalize(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

exports.list = function (req, res) {
    Skill.find({}).sort({name: 1}).select('_id name').exec(function (err, skills) {
        if (err) res.sendStatus(400);
        else {
            var array_skill = [],
                name = '';
            skills.forEach(function (skill) {
                name = lowerToCapitalize(skill.name);
                array_skill.push({_id: skill._id, name: name})
            })
            res.send(array_skill);
        }
    });
};

function send_email_request(skill, callback) {
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
    var mailOptions = {
        to: "melissa@volo.org.uk",
        bcc: "volo4change@gmail.com",
        from: 'VOLO <no-reply@volo.org.uk>',
        subject: "New skill request",
        html: 'A new skill has been requested to be added: <br/><br/>' +
        '<b>Skill name</b>: ' + skill.name + '<br/>' +
        '<b>Requested by</b>: ' + '<a href="http://localhost:5000/volunteer/' + skill.volunteer._id + '">' + skill.volunteer.name + '</a> <br/>' +
        'You can reach him at: <a href="mailto:' + skill.volunteer.email + '">' + skill.volunteer.email + '<a/>' + '<br/><br/>' +
        'Cheers',
        text: 'A new skill has been requested to be added: \n\n' +
        '<b>Skill name</b>: ' + skill.name + '\n\n' +
        '<b>Requested by</b>: ' + 'http://localhost:5000/volunteer/' + skill.volunteer._id + ' (' + skill.volunteer.name + ') \n\n' +
        'You can reach him at: ' + skill.volunteer.email + '\n\n' +
        'Cheers'
    };
    smtpTransport.sendMail(mailOptions, function (err) {
        if (err) console.log(err);
    })
}

exports.newRequest = function (req, res) {
    console.log(req.body);
    if (!req.body.name || !req.body.requested_by) {
        res.status(400);
        res.send('Field(s) missing');
    }
    else {
        Volunteer.findOne({_id: req.body.requested_by}, function (err, volunteer) {
            if (err) console.log(err);
            else {
                var skill = {
                    name: req.body.name,
                    volunteer: {
                        name: volunteer.first_name + ' ' + volunteer.last_name,
                        _id: volunteer._id,
                        email: volunteer.email
                    }
                };
                send_email_request(skill, function () {
                });
                res.sendStatus(200);
            }
        })
    }

}

exports.new = function (req, res) {
    if (!req.body.name || !req.body.suggested_by_volunteer || !req.body.created_by) {
        res.status(400);
        res.send('Field(s) missing');
    }
    else {
        var name = req.body.name;
        name = name.toLowerCase();
        if (Object.prototype.toString.call(name) === '[object Array]') {
            var name_is_array = true;
            name = name[0];
        }
        var sbv = req.body.suggested_by_volunteer;
        var created_by = req.body.created_by;
        var newSkill = Skill(
            {
                name: name,
                suggested_by_volunteer: sbv,
                created_by: created_by
            });
        newSkill.save(function (err) {
            if (err) {
                res.status(400);
                res.send('This skill already exists.');
            }
            else {
                if (name_is_array) {
                    res.status(201).send('Only ' + name + ' has been created. Only one skill can be added at a time');
                }
                else res.sendStatus(201);
            }
        })
    }
};
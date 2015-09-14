var express = require('express');
var mongoose = require('mongoose');
var Activity = require('./models/activity');
var Skill = require('./models/skill');
var Volunteer = require('./models/volunteer');
var ValidationPending = require('./models/validation_pending');
var Role = require('./models/role');
var nodemailer = require('nodemailer');

function getActi () {
  var uristring =
  process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/socialLift';
  var theport = process.env.PORT || 3000;

  mongoose.connect(uristring, function (err, res) {
    if (err) {
    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
    console.log ('Succeeded connected to: ' + uristring);
    console.log ('Running on port: ' + theport);
    }
  });

  ValidationPending.aggregate(
    [
    {$unwind: "$activities"},
    {$match: {
      'activities.sent': false,
      'activities.validated_via_email': false
    }},
    {
      $project: {
        referee_email:1,
        token:1,
        activity:"$activities.activity",
      }
    },
    {
      $group:
      {
        _id: {referee_email:'$referee_email', token:"$token"},
        activities: {$push: "$activity"},
        count: {$sum: 1},
      }
    }
    ],
    function (err, pendings) {
      Activity.populate(pendings, {path:'activities'}, function (err, activities) {
        Skill.populate(activities, {path:'activities.skills', select: 'name'}, function (err, skilled_pendings) {
               if (err) console.log(err);
               Role.populate(skilled_pendings, {path: 'activities.role', select: "name"}, function (err, skilled_roled_pendings) {
                 if (err) console.log(err);
                 Volunteer.populate(skilled_roled_pendings, {path: "activities.volunteer", select: 'first_name last_name'}, function (err, full_pendings) {
                   if (err) console.log(err);
                   else {
                     console.log(JSON.stringify(full_pendings));
                     mongoose.connection.close();
                     process.exit();
                     // sendEmail(full_pendings);
                   }
                 }); 
               });
             });
      });
    }
  );
}

function sendEmail (ToBeValidated) {
  ToBeValidated.forEach(function (pendings) {
    var r_email = pendings._id,
        r_name = pendings.activities[0].referee.name,
        v_name = pendings.activities[0].volunteer.first_name + ' ' + pendings.activities[0].volunteer.last_name;
        role = pendings.activities[0].role.name,
        start_date = pendings.activities[0].start_date,
        hours = pendings.activities[0].hours,
        count = pendings.count - 1,
        token = pendings.token,
        skills = [];

    pendings.activities[0].skills.forEach(function (skill) {
      skills.push(skill.name);
    });
    console.log(r_email);

    var smtpTransport = nodemailer.createTransport({
      host: 'smtp.mailgun.org',
      service: "Mailgun",
      auth: {
        user: "postmaster@mg.volo.org.uk",
        pass: "18682498971f9e94b4c22b6433284351"
      }
    });
    // TODO: HTML TEMPLATE
    // TODO: catch when count = 0
    var mailOptions = {
      to: r_email,
      from: 'Baptiste <baptiste@volo.org.uk>',
      subject: 'Please validate experience',
      text: 'Hello ' + r_name + ',\n\n' +
        'Volunteers have been adding activities with your Nonprofit, please validate these experiences \n\n' + 
        v_name + ' volunteered ' + hours + ' hours and acquired the following skills: ' + skills.join(', ') + '.\n' +
        'On our website, you\'ll also be able to validate ' + count + ' other new activities \n\n' +
        'thanks very much'
    };
    console.log(JSON.stringify(mailOptions));

    smtpTransport.sendMail(mailOptions, function (err, response) {
      if (err) {
        console.log('error');
        console.log(err);
        mongoose.connection.close();
        process.exit();
      }
      else {
        console.log('OK');
        mongoose.connection.close();
        process.exit();
      }
    });

    // console.log("send email to " + r_email + ' about ' + v_name + ' with skills ' + skills.join(', ') + ' and other activities ' + count);

  })
}

function removeFromList (ValidationPendingId) {
  ValidationPending.findOneAndUpdate({_id: ValidationPendingId}, {sent: true}, function (err, validation) {
    if (err) console.log(err);
    else {
      mongoose.connection.close();
      process.exit();
    }
  });
}
              
getActi();

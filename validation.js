var express = require('express');
var mongoose = require('mongoose');
var Activity = require('./models/activity');
var Skill = require('./models/skill');
var Volunteer = require('./models/volunteer');
var ValidationPending = require('./models/validation_pending');
var Role = require('./models/role');
var nodemailer = require('nodemailer');
var emailTemplates = require('email-templates');
var path = require('path');
var templatesDir = path.resolve(__dirname, 'templates', 'emails');
var async = require('async');
var config = require('./config');

function getActi () {

  mongoose.connect(config.mongo_uri, function (err, res) {
    if (err) {
    console.log ('ERROR connecting to: ' + config.mongo_uri + '. ' + err);
    } else {
    console.log ('Succeeded connected to: ' + config.mongo_uri);
    console.log ('Running on port: ' + config.theport);
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
      console.log("pendings");
      console.log(pendings);
      if (pendings.length > 0 ) {
        Activity.populate(pendings, {path:'activities'}, function (err, activities) {
          Skill.populate(activities, {path:'activities.skills', select: 'name'}, function (err, skilled_pendings) {
                 if (err) console.log(err);
                 Role.populate(skilled_pendings, {path: 'activities.role', select: "name"}, function (err, skilled_roled_pendings) {
                   if (err) console.log(err);
                   Volunteer.populate(skilled_roled_pendings, {path: "activities.volunteer", select: 'first_name last_name'}, function (err, full_pendings) {
                     if (err) console.log(err);
                     else {
                       // console.log(JSON.stringify(full_pendings));
                       // mongoose.connection.close();
                       // process.exit();
                       sendEmail(full_pendings);
                     }
                   }); 
                 });
              });
        });
      }
      else
      {
        console.log('nothing to change');
        mongoose.connection.close();
        process.exit();
      }
    }
  );
}

function sendEmail (ToBeValidated) {
  var tbv_length = ToBeValidated.length,
      i=0,
      locals = {},
      locals_array = [],
      r_email = '',
      r_name,
      v_name,
      role,
      start_date,
      hours,
      count,
      token,
      activities_to_remove;

  var smtpTransport = nodemailer.createTransport({
    // host: 'smtp.mailgun.org',
    // service: "Mailgun",
    // auth: {
    //   user: "postmaster@mg.volo.org.uk",
    //   pass: "18682498971f9e94b4c22b6433284351"
    // }
    host: '127.0.0.1',
    port: 1025
  });

  ToBeValidated.forEach(function (pendings) {
    r_email = pendings._id.referee_email;
    r_name = pendings.activities[0].referee.name;
    v_name = pendings.activities[0].volunteer.first_name + ' ' + pendings.activities[0].volunteer.last_name;
    role = pendings.activities[0].role.name;
    start_date = pendings.activities[0].start_date;
    hours = pendings.activities[0].hours;
    count = pendings.count - 1;
    token = pendings._id.token;
    skills_array = [],
    activities_to_remove = [];

    pendings.activities[0].skills.forEach(function (skill) {
      skills_array.push(skill.name);
    });
    skills = skills_array.join(', ');
    for (var j=0;j<pendings.activities.length;j++)
    {
      activities_to_remove.push(pendings.activities[j]._id)
    }

    locals = {
      referee: {name: r_name, email: r_email},
      volunteer: {name: v_name},
      start_date: start_date,
      hours: hours,
      count: count,
      skills: skills,
      url: config.url + '/activity/validation/?email='+r_email+ '&token=' + token,
      activities_to_remove: activities_to_remove
    };
    locals_array.push(locals);
  });

    locals_array.forEach(function (locals) {
        emailTemplates(templatesDir, function(err, template) {
          if (err) {
             console.log(err);
          } 
          else {
          template('activityValidation', locals, function(err, html, text) {
            if (err) {
              console.log(err);
            } else {
              smtpTransport.sendMail({
                from: 'Baptiste <baptiste@volo.org.uk>',
                to: locals.referee.name + "<" + locals.referee.email + ">",
                subject: 'VOLO: Please validate experiences',
                html: html,
                text: text
              }, function(err, responseStatus) {
                if (err) {
                  console.log(err);
                  // mongoose.connection.close();
                  // process.exit();
                } else {
                  console.log(responseStatus);
                  i++;
                  console.log("activities_to_remove");
                  console.log(activities_to_remove);
                  locals.activities_to_remove.forEach(function (activity) {
                    console.log("removing + " + activity);
                    if (tbv_length == i){
                      removeFromList(activity, true);
                    }
                    else removeFromList(activity);
                  })
                  }
                  // mongoose.connection.close();
                  // process.exit();
                });
            }
          });
        }
      })
    })

    // var smtpTransport = nodemailer.createTransport({
    //   host: 'smtp.mailgun.org',
    //   service: "Mailgun",
    //   auth: {
    //     user: "postmaster@mg.volo.org.uk",
    //     pass: "18682498971f9e94b4c22b6433284351"
    //   }
    // });
    // TODO: HTML TEMPLATE
    // TODO: catch when count = 0
    // var mailOptions = {
    //   to: r_email,
    //   from: 'Baptiste <baptiste@volo.org.uk>',
    //   subject: 'Please validate experience',
    //   text: 'Hello ' + r_name + ',\n\n' +
    //     'Volunteers have been adding activities with your Nonprofit, please validate these experiences \n\n' + 
    //     v_name + ' volunteered ' + hours + ' hours and acquired the following skills: ' + skills.join(', ') + '.\n' +
    //     'On our website, you\'ll also be able to validate ' + count + ' other new activities \n\n' +
    //     'thanks very much'
    // };
    // console.log(JSON.stringify(mailOptions));

    // smtpTransport.sendMail(mailOptions, function (err, response) {
    //   if (err) {
    //     console.log('error');
    //     console.log(err);
    //     mongoose.connection.close();
    //     process.exit();
    //   }
    //   else {
    //     console.log('OK');
    //     mongoose.connection.close();
    //     process.exit();
    //   }
    // });

    // console.log("send email to " + r_email + ' about ' + v_name + ' with skills ' + skills.join(', ') + ' and other activities ' + count);
}

function removeFromList (id, last) {
  ValidationPending.findOneAndUpdate({
    activities: {$elemMatch: { activity: id}}}, {"activities.$.sent": true}, function (err, validation) {
    if (err) console.log(err);
    else {
      console.log(validation);
      console.log('changed');
      if (last) 
      {
        console.log("last");
        mongoose.connection.close();
        process.exit();
      }
    }
  });
}
              
getActi();

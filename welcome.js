var express = require('express');
var mongoose = require('mongoose');
var emailTemplates = require('email-templates');
var path = require('path');
var nodemailer = require('nodemailer');
var templatesDir = path.resolve(__dirname, 'templates', 'emails');

// get parameters from process

function get_params () {
  process.argv.forEach(function(val, index, array) {
    console.log(index + ': ' + val);
    console.log(array[2]);
  });
  // sendEmail(locals);
}

get_params();

function sendEmail (volunteer)
{
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

  locals = {
    email: volunteer.email,
    name: volunteer.first_name + ' ' + volunteer.last_name,
    url: 'http://localhost:3000/volunteer/edit'
  };
  // to do change url
  emailTemplates(templatesDir, function(err, template) {
    if (err) {
       console.log(err);
    } 
    else {
    template('welcome', locals, function(err, html, text) {
      if (err) {
        console.log(err);
      } else {
        smtpTransport.sendMail({
          from: 'VOLO <welcome@volo.org.uk>',
          to: locals.name + "<" + locals.email + ">",
          subject: 'Welcome to VOLO',
          html: html,
          text: text
        }, function(err, responseStatus) {
          if (err) {
            console.log(err);
          } 
          else {
            console.log('WELCOME EMAIL SENT SUCCESSFULLY');
          }
        });
      }
    });
  }
})
}
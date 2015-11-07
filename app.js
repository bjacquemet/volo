require('newrelic');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('express-flash');
var bcrypt = require('bcrypt-nodejs');
var multer = require('multer');
var compression = require('compression');
var qt = require('quickthumb');
var done = false;
var config = require('./config');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var routes = require('./routes/index');
var volunteers = require('./routes/volunteer');
var skills = require('./routes/skill');
var roles = require('./routes/role');
var nonprofits = require('./routes/nonprofit');
var experiences = require('./routes/experience');
var activities = require('./routes/activity');
var universities = require('./routes/university');

var app = express();

app.use(multer({
    dest: './public/uploads/',
    limits: {files: 1},
    rename: function (fieldname, filename) {
        return filename + Date.now();
    },
    onFileUploadStart: function (file) {
        console.log(file.originalname + ' is starting ...')
    },
    onFileUploadComplete: function (file) {
        console.log(file.fieldname + ' uploaded to  ' + file.path);
        done = true;
    }
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// GZIP CONTENT
app.use(compression());

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'volo session secret',
    cookie: {maxAge: 14 * 24 * 60 * 60 * 1000},
    resave: false,
    saveUninitialized: false,
    store: new MongoStore(
        {
            mongooseConnection: mongoose.connection,
            clear_interval: 3600,
            autoRemove: 'interval'
        }, function (err) {
            console.log(err || 'connection OK');
        })
}));
app.use(passport.initialize());
app.use(passport.session());

var maxAge = 31536000000;
app.use(express.static(path.join(__dirname, 'public'), {maxAge: maxAge, etag: true}));
app.use('/public/uploads/', qt.static(__dirname + '/public/uploads/'));
app.use(flash());

//  Load routes
app.use('/', routes);
app.use('/volunteer', volunteers);
app.use('/skill', skills);
app.use('/role', roles);
app.use('/nonprofit', nonprofits);
app.use('/experience', experiences);
app.use('/activity', activities);
app.use('/university', universities);

// Passport config
var Volunteer = require('./models/volunteer');
passport.use(new LocalStrategy(Volunteer.authenticate()));
passport.serializeUser(Volunteer.serializeUser());
passport.deserializeUser(Volunteer.deserializeUser());


var options = {
    server: {socketOptions: {keepAlive: 1, connectTimeoutMS: 30000}},
    replset: {socketOptions: {keepAlive: 1, connectTimeoutMS: 30000}}
};

mongoose.connect(config.mongo_uri, options, function (err, res) {
    if (err) {
        console.log ('ERROR connecting to: ' + config.mongo_uri + '. ' + err);
    } else {
        console.log ('Succeeded connected to: ' + config.mongo_uri);
        console.log ('Running on port: ' + config.theport);
    }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.header('Cache-Control', 'public, max-age=31557600');
        res.render('error', {
            title: 'Page not found',
            message: err.message,
            error: err,
            user: req.user
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.header('Cache-Control', 'public, max-age=31557600');
    console.log(err);
    res.render('error', {
        title: 'Page not found',
        message: err.message,
        error: {},
        user: req.user
    });
});

module.exports = app;

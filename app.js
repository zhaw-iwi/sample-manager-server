var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var expressValidator = require('express-validator');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

// Routes
var routes = require('./routes/index');
var users = require('./routes/users');
var projects = require('./routes/projects');
var measures = require('./routes/measures');
var rules = require('./routes/rules');
var records = require('./routes/records');

var app = express();

// DB setup
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/sampleManagerDb');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connection to DB established');
    // Session setup
    app.use(cookieParser('mySecret'));
    app.use(session({
        secret: 'mySecret',
        saveUninitialized: true, // create session until something stored
        resave: true, // save session if unmodified
        store: new MongoStore({mongooseConnection: mongoose.connection}),
        proxy: true
    }));

    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');

    // uncomment after placing your favicon in /public
    //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));

    app.use(express.static(path.join(__dirname, 'public')));
    //app.use(expressValidator);

    // Add response headers
    app.use(function (req, res, next) {
        // Allow connections from svendroid.com
        //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.setHeader('Access-Control-Allow-Origin', 'http://svendroid.com');
        // Allowed request methods
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        // Allowed request headers
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        // Include cookies in the request sent
        res.setHeader('Access-Control-Allow-Credentials', true);

        next();
    });

    // Routes
    app.use('/api/', routes);
    app.use('/api/users', users);
    app.use('/api/projects', projects);
    app.use('/api/measures', measures);
    app.use('/api/rules', rules);
    app.use('/api/records', records);

    //app.param('userId', require('./controllers/users').user);

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
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });

});

module.exports = app;

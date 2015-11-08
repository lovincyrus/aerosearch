/********************* DO NOT MODIFY **********************/
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var mysql = require('mysql');
var async = require('async');
/**********************************************************/


/******************** OKAY TO MODIFY **********************/
var routes = require('./routes/index');
var hike = require('./routes/hike');
/**********************************************************/


/********************* DO NOT MODIFY **********************/
var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('connection', mysql.createConnection({
  host: process.env.RDS_HOSTNAME,      // do not commit hardcoded values
  user: process.env.RDS_USERNAME,      // do not commit hardcoded values
  port: process.env.RDS_PORT,          // do not commit hardcoded values
  password: process.env.RDS_PASSWORD   // do not commit hardcoded values
}));
/**********************************************************/

var client = app.get('connection');
async.series([
  function connect(callback) {
    client.connect(callback);
  },
  function clear(callback) {
    client.query('DROP DATABASE IF EXISTS mynode_db', callback);
  },
  function create_db(callback) {
    client.query('CREATE DATABASE mynode_db', callback);
  },
  function use_db(callback) {
    client.query('USE mynode_db', callback);
  },
  function create_table(callback) {
     client.query('CREATE TABLE HIKES (' +
                         'ID VARCHAR(40), ' +
                         'HIKE_DATE DATE, ' +
                         'NAME VARCHAR(40), ' +
                         'DISTANCE VARCHAR(40), ' +
                         'LOCATION VARCHAR(40), ' +
                         'WEATHER VARCHAR(40), ' +
                         'PRIMARY KEY(ID))', callback);
  },
  function insert(callback) {
    var hike = {
      HIKE_DATE: new Date(),
      NAME: 'Someone',
      LOCATION: 'Glacier Point, Yosemite',
      DISTANCE: '7,000 ft',
      WEATHER:'Cold'
    };
    client.query('INSERT INTO HIKES set ?', hike, callback);
  }
], function (err, results) {
  if (err) {
    // Exception initializing database
    throw err;
  } else {
    // Database initialization complete
  }
});

app.use('/', routes);
app.get('/hikes', hike.index);
app.post('/add_hike', hike.add_hike);

/********************* DO NOT MODIFY **********************/

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Development error handler. Will print stacktrace.
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// Production error handler. No stacktraces leaked to user.
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
/**********************************************************/
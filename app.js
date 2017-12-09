var path = require('path');
var express = require('express');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var $ = require('jquery');
var cors = require('cors');
var najax = require('najax');

var tutorial = require('./routes/tutorial');
var index = require('./routes/index');
var dashboard = require('./routes/dashboard');
var legal = require('./routes/legal');
var developers = require('./routes/developers');

var app = express();

app.use(cors());
// view engine setup
app.set('views', path.join(__dirname, './public/views'));
app.set('view engine', 'ejs');

app.use(favicon(__dirname + '/public/images/fav.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/dashboard', express.static(path.join(__dirname, '/public')));
app.use('/legal', express.static(path.join(__dirname, '/public')));
app.use('/developers', express.static(path.join(__dirname, '/public')));

app.use('/', index);
app.use('/tutorial', tutorial);
app.use('/dashboard/*', dashboard);
app.use('/legal', legal);
app.use('/developers', developers);

var fs = require('fs');
var activeDomain = '';

fs.readFile('activeDomain.txt', 'utf8', function (err, data){
    var json = JSON.parse(data);
    activeDomain = json["url2"];
    exports.activeDomain = activeDomain;
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
// production error handler
// no stacktraces leaked to user


module.exports = app;
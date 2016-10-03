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
app.set('views', path.join(__dirname, './views'));
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

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.redirect('https://localhost:3000/#error5'); //change to timer.gg for relaunch
});

module.exports = app;

najax({
    url: 'https://global.api.pvp.net/api/lol/static-data/na/v1.2/rune?api_key=804a0b1e-6f03-4124-94eb-7b64f48c5701',
    type: 'POST',
    dataType: 'json',
    success: function (resp) {
        exports.runeList = resp['data'];
    },
    error: function () {
        console.log('API call for rune list was unsuccessful');
    }
});

najax({
    url: 'https://global.api.pvp.net/api/lol/static-data/na/v1.2/mastery?api_key=804a0b1e-6f03-4124-94eb-7b64f48c5701',
    type: 'POST',
    dataType: 'json',
    success: function (resp) {
        exports.masteryList = resp['data'];
    },
    error: function () {
        console.log('API call for mastery list was unsuccessful');
    }
});









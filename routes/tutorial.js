var express = require('express');
var router = express.Router();
var najax = require('najax');
var http = require('http');
var app = require('../app.js');
var api_key, activeDomain = '';
var fs = require('fs');

fs.readFile('api_key.txt', 'utf8', function (err, data) {
    api_key = data;
});

router.get('/', function (req, res) {
    activeDomain = app.activeDomain;
    console.log('tut');
    var url = req.originalUrl;
    if (url == '/tutorial') {
        najax({
            url: 'https://na.api.pvp.net/observer-mode/rest/featured?api_key=' + api_key,
            type: 'POST',
            dataType: 'json',
            success: function (resp) {
                var found = false;
                for (var i = 0; i < resp['gameList'].length; i++) {
                    if (resp['gameList'][i]['gameMode'] == 'CLASSIC' || resp['gameList'][i]['gameMode'] == 'ARAM') {
                        var testName = resp['gameList'][i]['participants'][1]['summonerName'];
                        testName = testName.split(' ').join('');
                        found = true;
                        res.redirect(activeDomain+'/dashboard/playerName=' + testName + '/na');
                        break;
                    }
                }
                if (!found) {
                    res.redirect(activeDomain+'/#error4');
                }
            },
            error: function (e) {
                res.redirect(activeDomain+'/#error4');
            }
        })
    }
});

module.exports = router;

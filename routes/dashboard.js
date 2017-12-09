var express = require('express');
var router = express.Router();
var najax = require('najax');
var app = require('../app.js');
var fs = require('fs');
var api_key, activeDomain = '';

fs.readFile('apiKey.txt', 'utf8', function (err, data) {
    api_key = data;
});

function isAdequateLength(input) {
    var length = input.length;
    return (length >= 2 && length < 100);
}

function checkInputIsAlphaNumeric(input) {
    var alphanumerics = /[!@#$^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    return (input.match(alphanumerics));
}

/* GET dashboard */
router.get('/', function (req, res) {

    var url = req.originalUrl;
    var splitCon = url.match('=(.*)/');
    var splitName = splitCon[1].split('+').join('');
    var reg = url.split('/').pop();
    activeDomain = app.activeDomain;

    var regionRef = {
        na: 'NA1',
        br: 'BR1',
        eune: 'EUN1',
        euw: 'EUW1',
        kr: 'KR',
        lan: 'LA1',
        las: 'LA2',
        oce: 'OC1',
        tr: 'TR1',
        ru: 'RU'
    };

    if (checkInputIsAlphaNumeric(splitName) === null && checkInputIsAlphaNumeric(reg) === null && isAdequateLength(splitName)) {
        var eTeam = [];
        var aTeam = [];
        najax({
            url: 'https://' + regionRef[reg]+ '.api.riotgames.com/lol/summoner/v3/summoners/by-name/' + splitName + '?api_key=' + api_key,
            type: 'POST',
            dataType: 'json',
            success: function (resp) {
                console.log(resp);
                try {
                    var playerID = resp.id;
                    var correctCase = resp.name;
                }
                catch (e) {
                    res.redirect(activeDomain+'/#error4');
                    return;
                }
                console.log('>>>>>> : ' + playerID, splitName);
                najax({
                    url: 'https://' + regionRef[reg] + '.api.riotgames.com/lol/spectator/v3/active-games/by-summoner/' + playerID + '?api_key=' + api_key,
                    type: 'POST',
                    dataType: 'json',
                    success: function (r) {
                        console.log(r);
                        var gameLength = r['gameLength'];
                        var gameMode = r['gameMode'];
                        var participants = r['participants'];
                        for (var player in participants) {
                            var pName = participants[player]['summonerName'];
                            if (pName === correctCase) {
                                var allyTeamId = participants[player]['teamId'];
                                break;
                            }
                        }
                        for (var p in r['participants']) {
                            if (participants[p]['teamId'] !== allyTeamId) {
                                eTeam.push({
                                    summonerName: participants[p]['summonerName'],
                                    championId: participants[p]['championId'],
                                    spell1Id: participants[p]['spell1Id'],
                                    spell2Id: participants[p]['spell2Id'],
                                    teamId: participants[p]['teamId']
                                });
                            } else {
                                aTeam.push({
                                    summonerName: participants[p]['summonerName'],
                                    championId: participants[p]['championId'],
                                    spell1Id: participants[p]['spell1Id'],
                                    spell2Id: participants[p]['spell2Id'],
                                    teamId: participants[p]['teamId']
                                });
                            }
                        }

                        //render dashboard
                        if (gameMode === 'CLASSIC' || gameMode === 'ARAM') {
                            res.render('dashboard', {
                                title: 'TIMER.GG',
                                playerInstance: correctCase,
                                enemyTeam: eTeam,
                                allyTeam: aTeam,
                                gameLength: gameLength,
                            });
                        } else { //!classic mode
                            res.redirect(activeDomain+'/#error3');
                            res.end();
                        }
                    },
                    error: function () { //player !inGame
                        res.redirect(activeDomain+'/#error2');
                        res.end();
                    }
                })
            },
            error: function () { //playerName !exist
                res.redirect(activeDomain+'/#error1');
                res.end();
            }
        })
    } else {
        res.redirect('/#error');
        res.end();
    }
});
module.exports = router;



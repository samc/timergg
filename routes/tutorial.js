var express = require('express'),
    router = express.Router(),
    najax = require('najax'),
    app = require('../app.js'),
    api_key, activeDomain = '',
    fs = require('fs');

fs.readFile('apiKey.txt', 'utf8', function (err, data) {
    api_key = data;
});

router.get('/', function (req, res) {
    console.log('tut');

    var eTeam = [],
        aTeam = [];
    najax({
        url: 'https://na1.api.riotgames.com/lol/spectator/v3/featured-games?api_key=' + api_key,
        type: 'POST',
        dataType: 'json',
        success: function (r) {
            console.log(r);
            r = r['gameList'][0];

            const gameLength = r['gameLength'],
                gameMode = r['gameMode'],
                participants = r['participants'],
                allyTeamId = 100;

            for (var p = 0; p < r['participants'].length; p++) {
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
                console.log('render dashboard');
                res.render('dashboard', {
                    title: 'TIMER.GG',
                    playerInstance: participants[0]['summonerName'],
                    enemyTeam: eTeam,
                    allyTeam: aTeam,
                    gameLength: gameLength,
                    runes: app.runeList,
                    masteries: app.masteryList
                });
            } else { //!classic mode
                res.redirect('/#error3');
                res.end();
            }
        },
        error: function () { //player !inGame
            res.redirect('/#error2');
            res.end();
        }
    })

});

module.exports = router;

let express = require('express'),
    router = express.Router(),
    najax = require('najax'),
    app = require('../app.js'),
    api_key, activeDomain = '',
    fs = require('fs');

fs.readFile('api_key.txt', 'utf8', function (err, data) {
    api_key = data;
});

router.get('/', function (req, res) {
    console.log('tut');

    let eTeam = [],
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

            for (let p = 0; p < r['participants'].length; p++) {
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
                    playerInstance: participants[0]['summonerName'],
                    enemyTeam: eTeam,
                    allyTeam: aTeam,
                    gameLength: gameLength,
                    runes: app.runeList,
                    masteries: app.masteryList
                });
            } else { //!classic mode
                res.redirect(activeDomain + '/#error3');
                res.end();
            }
        },
        error: function () { //player !inGame
            res.redirect(activeDomain + '/#error2');
            res.end();
        }
    })

});

module.exports = router;

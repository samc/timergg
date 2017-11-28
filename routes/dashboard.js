var express = require('express');
var router = express.Router();
var najax = require('najax');
var http = require('http');
var app = require('../app.js');
var fs = require('fs');
var api_key, activeDomain = '';

fs.readFile('api_key.txt', 'utf8', function (err, data) {
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
    var splitCall = decodeURI(splitName).toLowerCase();
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

    /*var champion = [{

        id: ['atrix', 'attracts'],
        name: 'Aatrox',
        icon: 266
    }, {
        id: ['re'],
        name: 'Ahri',
        icon: 103
    }, {
        id: ['akali'],
        name: 'Akali',
        icon: 84
    }, {
        id: ['allistar', 'all star'],
        name: 'Alistar',
        icon: 12
    }, {
        id: ['a muumuu', 'amumu'],
        name: 'Amumu',
        icon: 32
    }, {
        id: ['interview', 'nivea', 'in india'],
        name: 'Anivia',
        icon: 34
    }, {
        id: ['any', 'manny', 'in a'],
        name: 'Annie',
        icon: 1
    }, {
        id: ['-', 'pass', 'ash', 'as', 'cash'],
        name: 'Ashe',
        icon: 22
    }, {
        id: ['easier', 'of the', 'as a', 'as you'],
        name: 'Azir',
        icon: 268
    }, {
        id: ['barred', 'card'],
        name: 'Bard',
        icon: 432
    }, {
        id: ['blitz'],
        name: 'Blitzcrank',
        icon: 53
    }, {
        id: ['friend'],
        name: 'Brand',
        icon: 63
    }, {
        id: ['from', 'bomb', 'prom'],
        name: 'Braum',
        icon: 201
    }, {
        id: ['caitlin'],
        name: 'Caitlyn',
        icon: 51
    }, {
        id: ['pass'],
        name: 'Cassiopeia',
        icon: 69
    }, {
        id: ['toget', 'show gas', 'to gas', 'focus', 'show gas', 'show'],
        name: 'Cho\'Gath',
        icon: 31
    }, {
        id: ['corky', 'porky'],
        name: 'Corki',
        icon: 42
    }, {
        id: ['areas', 'dharius', 'sirius', 'period'],
        name: 'Darius',
        icon: 122
    }, {
        id: ['vienna'],
        name: 'Diana',
        icon: 131
    }, {
        id: ['mundo', 'dr mundo'],
        name: 'Dr. Mundo',
        icon: 36
    }, {
        id: [''],
        name: 'Draven',
        icon: 119
    }, {
        id: ['echo', 'ago'],
        name: 'Ekko',
        icon: 245
    }, {
        id: ['at least', 'police', 'release'],
        name: 'Elise',
        icon: 60
    }, {
        id: ['evelyn', 'eve'],
        name: 'Evelynn',
        icon: 28
    }, {
        id: ['azrael', 'israel', 'as', 'as real', 'is real'],
        name: 'Ezreal',
        icon: 81
    }, {
        id: ['fiddle'],
        name: 'Fiddlesticks',
        icon: 9
    }, {
        id: ['ciara', 'viewer', 't ara', 'for a', 'for', 'you are', 'feur', 'fewr', 'few are'],
        name: 'Fiora',
        icon: 114
    }, {
        id: ['sis', 'is', 'foods', 'physica', 'face'],
        name: 'Fizz',
        icon: 105
    }, {
        id: [''],
        name: 'Galio',
        icon: 3
    }, {
        id: ['gp'],
        name: 'Gangplank',
        icon: 41
    }, {
        id: ['erin'],
        name: 'Garen',
        icon: 86
    }, {
        id: ['no', 'not', 'nor', 'are', 'in our', 'our'],
        name: 'Gnar',
        icon: 150
    }, {
        id: ['ragus', 'caracas', 'vegas', 'ragga'],
        name: 'Gragas',
        icon: 79
    }, {
        id: ['grey\'s'],
        name: 'Graves',
        icon: 104
    }, {
        id: [''],
        name: 'Hecarim',
        icon: 120
    }, {
        id: ['donner', 'longer', 'donger'],
        name: 'Heimerdinger',
        icon: 74
    }, {
        id: ['allow a', 'allow we', 'allowe me', 'allowed', 'allowing'],
        name: 'Illaoi',
        icon: 420
    }, {
        id: [''],
        name: 'Irelia',
        icon: 39
    }, {
        id: ['johnny', 'jana', 'camera', 'jonna', 'johnna', 'donna'],
        name: 'Janna',
        icon: 40
    }, {
        id: ['garden', 'jarvan', 'jarvan the fourth', 'j 4', 'g 4', 'german'],
        name: 'Jarvan IV',
        icon: 59
    }, {
        id: ['jack', 'jack\'s', 'jacks'],
        name: 'Jax',
        icon: 24
    }, {
        id: ['chase', 'jace', 'juice', 'juice'],
        name: 'Jayce',
        icon: 126
    }, {
        id: ['gym', 'in', 'gin'],
        name: 'Jhin',
        icon: 202
    }, {
        id: ['blinks', 'brinks', 'chinks', 'drinks', 'finks', 'inc.\'s', 'inks', 'jinks', 'jynx', 'kinks', 'links', 'lynx', 'mincks', 'minks', 'pinks', 'rinks', 'shrinks', 'sinks', 'skinks', 'sphinx', 'spinks', 'stinks', 'think\'s', 'thinks', 'winks'],
        name: 'Jinx',
        icon: 222
    }, {
        id: ['calista', 'callista'],
        name: 'Kalista',
        icon: 429
    }, {
        id: [',', 'CARMA'],
        name: 'Karma',
        icon: 43
    }, {
        id: [''],
        name: 'Karthus',
        icon: 30
    }, {
        id: [''],
        name: 'Kassadin',
        icon: 38
    }, {
        id: [''],
        name: 'Katarina',
        icon: 55
    }, {
        id: ['kill', 'will', 'sale', 'scale', 'till'],
        name: 'Kayle',
        icon: 10
    }, {
        id: ['tenon', 'cannon', 'canon'],
        name: 'Kennen',
        icon: 85
    }, {
        id: ['bug'],
        name: 'Kha\'Zix',
        icon: 121
    }, {
        id: [''],
        name: 'Kindred',
        icon: 203
    }, {
        id: ['card', 'cog', 'dog'],
        name: 'Kog\'Maw',
        icon: 96
    }, {
        id: [''],
        name: 'LeBlanc',
        icon: 7
    }, {
        id: ['leasing', 'leeson', 'listen', 'lease in'],
        name: 'Lee Sin',
        icon: 64
    }, {
        id: [''],
        name: 'Leona',
        icon: 89
    }, {
        id: ['andhra', 'andra'],
        name: 'Lissandra',
        icon: 127
    }, {
        id: ['lucien', 'machine', 'illusion', 'motion'],
        name: 'Lucian',
        icon: 236
    }, {
        id: [''],
        name: 'Lulu',
        icon: 117
    }, {
        id: [''],
        name: 'Lux',
        icon: 99
    }, {
        id: [''],
        name: 'Malphite',
        icon: 54
    }, {
        id: [''],
        name: 'Malzahar',
        icon: 90
    }, {
        id: ['alki', 'tree', 'malka', '3', 'malachi', 'malakai'],
        name: 'Maoki',
        icon: 57
    }, {
        id: ['master', 'masters'],
        name: 'Master Yi',
        icon: 11
    }, {
        id: ['misfortune', 'MF'],
        name: 'Miss Fortune',
        icon: 21
    }, {
        id: [''],
        name: 'Mordekaiser',
        icon: 82
    }, {
        id: [''],
        name: 'Morgana',
        icon: 25
    }, {
        id: ['na me', 'mommy', 'mami'],
        name: 'Nami',
        icon: 267
    }, {
        id: ['asus', 'basis', 'nieces', 'nasa', 'susan'],
        name: 'Nasus',
        icon: 75
    }, {
        id: [''],
        name: 'Nautilus',
        icon: 111
    }, {
        id: ['in italy', 'need', 'did'],
        name: 'Nidalee',
        icon: 76
    }, {
        id: [''],
        name: 'Nocturne',
        icon: 56
    }, {
        id: [''],
        name: 'Nunu',
        icon: 20
    }, {
        id: [''],
        name: 'Olaf',
        icon: 2
    }, {
        id: ['oriana'],
        name: 'Orianna',
        icon: 61
    }, {
        id: [''],
        name: 'Pantheon',
        icon: 80
    }, {
        id: ['papi', 'poppy'],
        name: 'Poppy',
        icon: 78
    }, {
        id: ['twin', 'win', 'queen'],
        name: 'Quinn',
        icon: 133
    }, {
        id: ['ramus', 'ramis', 'remus'],
        name: 'Rammus',
        icon: 33
    }, {
        id: ['rec side', 'wreck site', 'rex i', 'rex'],
        name: 'Rek\'Sai',
        icon: 421
    }, {
        id: [''],
        name: 'Renekton',
        icon: 58
    }, {
        id: ['wrangler'],
        name: 'Rengar',
        icon: 107
    }, {
        id: ['ribbon'],
        name: 'Riven',
        icon: 92
    }, {
        id: [''],
        name: 'Rumble',
        icon: 68
    }, {
        id: ['wise'],
        name: 'Ryze',
        icon: 13
    }, {
        id: ['to johhny', 'said ronnie', 'did ronnie', 'to do any', 'to gianni', 'set', 'said'],
        name: 'Sejuani',
        icon: 113
    }, {
        id: ['shako', 'chicago', 'shake', 'shaking', 'check'],
        name: 'Shaco',
        icon: 35
    }, {
        id: [''],
        name: 'Shen',
        icon: 98
    }, {
        id: ['shyvana', 'she wanna'],
        name: 'Shyvanna',
        icon: 102
    }, {
        id: ['since', 'send', 'sync'],
        name: 'Singed',
        icon: 27
    }, {
        id: [''],
        name: 'Sion',
        icon: 14
    }, {
        id: ['silver', 'server', 'severe'],
        name: 'Sivir',
        icon: 15
    }, {
        id: [''],
        name: 'Skarner',
        icon: 72
    }, {
        id: ['so no'],
        name: 'Sona',
        icon: 37
    }, {
        id: ['goat'],
        name: 'Soraka',
        icon: 16
    }, {
        id: ['swing', 'swim', 'swin'],
        name: 'Swain',
        icon: 50
    }, {
        id: [''],
        name: 'Syndra',
        icon: 134
    }, {
        id: ['tom can\'t', 'tomkins', 'punk inch'],
        name: 'Tahm Kench',
        icon: 223
    }, {
        id: ['telling'],
        name: 'Talon',
        icon: 91
    }, {
        id: ['tara', 'tarak', 'touring', 'pirate'],
        name: 'Taric',
        icon: 44
    }, {
        id: ['timo', 'bmo', 'devil', 'demon'],
        name: 'Teemo',
        icon: 17
    }, {
        id: ['thrush'],
        name: 'Thresh',
        icon: 412
    }, {
        id: ['to astana', 'to start a'],
        name: 'Tristana',
        icon: 18
    }, {
        id: [''],
        name: 'Trundle',
        icon: 48
    }, {
        id: [''],
        name: 'Tryndamere',
        icon: 23
    }, {
        id: ['ts', 'tf'],
        name: 'Twisted Fate',
        icon: 4
    }, {
        id: [''],
        name: 'Twitch',
        icon: 29
    }, {
        id: ['you dear', 'to deer', 'of deer', 'of year'],
        name: 'Udyr',
        icon: 77
    }, {
        id: ['i got', 'forgot', 'got'],
        name: 'Urgot',
        icon: 6
    }, {
        id: ['various', 'virus', 'there is'],
        name: 'Varus',
        icon: 110
    }, {
        id: ['then', 'vain'],
        name: 'Vayne',
        icon: 67
    }, {
        id: [''],
        name: 'Veigar',
        icon: 45
    }, {
        id: ['will cause', 'thought cause', 'tentacles'],
        name: 'Vel\'Koz',
        icon: 161
    }, {
        id: ['by', 'the', 'i'],
        name: 'Vi',
        icon: 254
    }, {
        id: ['victor'],
        name: 'Viktor',
        icon: 112
    }, {
        id: ['lighted mirror', 'gladimir', 'glad', 'lag'],
        name: 'Vladimir',
        icon: 8
    }, {
        id: ['boulevard'],
        name: 'Volibear',
        icon: 106
    }, {
        id: ['war with'],
        name: 'Warwick',
        icon: 19
    }, {
        id: ['uconn', 'you can', 'will come', 'monkey'],
        name: 'Wukong',
        icon: 62
    }, {
        id: ['is there is', 'there is', '0', 'exeris', 'exist'],
        name: 'Xerath',
        icon: 101
    }, {
        id: ['in a', 'in 0', 'jinjo', 'to enjoy', 'you enjoy', 'is anzo', 'since i\'ll', 'runs out'],
        name: 'Xin Zhao',
        icon: 5
    }, {
        id: ['yeah so', 'yes or', 'you saw a', 'yahoo', 'is all', 'you so', 'yes it will', 'yahshua', 'lol'],
        name: 'Yasuo',
        icon: 157
    }, {
        id: [''],
        name: 'Yorick',
        icon: 83
    }, {
        id: ['black', 'a', 'back', 'a week', 'jack', 'zach'],
        name: 'Zac',
        icon: 154
    }, {
        id: ['led', 'and', 'dead', 'said'],
        name: 'Zed',
        icon: 238
    }, {
        id: [''],
        name: 'Ziggs',
        icon: 115
    }, {
        id: ['alien', 'zillion'],
        name: 'Zilean',
        icon: 26
    }, {
        id: ['zara', 'zero', 'ira'],
        name: 'Zyra',
        icon: 143
    }];

    var rhyme = require('rhyme');
    rhyme(function (r) {
        for (var x = 0; x < champion.length; x++) {
            var championName = champion[x].name;
            if (r.rhyme(championName).length == 0) {
                for (var c = 0; c < champion[x].id.length; c++) {
                    var champRef = champion[x].id[c];
                    if (r.rhyme(champRef).length != 0) {
                        championName = champRef;
                        break;
                    }
                }
            }

            var rhymeList = r.rhyme(championName.toLowerCase());
            for (var z = 0; z < rhymeList.length; z++) {
                champion[x].id.push(rhymeList[z].toLowerCase());
            }
        }
        console.log(champion)
    });
     */

    if (checkInputIsAlphaNumeric(splitName) === null && checkInputIsAlphaNumeric(reg) === null && isAdequateLength(splitName)) {
        var eTeam = [];
        var aTeam = [];
        console.log('https://' + regionRef[reg]+ '.api.riotgames.com/lol/summoner/v3/summoners/by-name/' + splitName + '?api_key=' + api_key);
        najax({
            url: 'https://' + regionRef[reg]+ '.api.riotgames.com/lol/summoner/v3/summoners/by-name/' + splitName + '?api_key=' + api_key,
            type: 'POST',
            dataType: 'json',
            success: function (resp) {
                console.log(resp);
                try {
                    var playerID = resp.accountId;
                    var correctCase = resp.name;
                }
                catch (e) {
                    res.redirect(activeDomain+'/#error4');
                    return;
                }
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
                                    runeIds: participants[p]['runes'],
                                    masteryIds: participants[p]['masteries'],
                                    teamId: participants[p]['teamId']
                                });
                            } else {
                                aTeam.push({
                                    summonerName: participants[p]['summonerName'],
                                    championId: participants[p]['championId'],
                                    spell1Id: participants[p]['spell1Id'],
                                    spell2Id: participants[p]['spell2Id'],
                                    runeIds: participants[p]['runes'],
                                    masteryIds: participants[p]['masteries'],
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
                                runes: app.runeList,
                                masteries: app.masteryList
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
        res.redirect(activeDomain+'/#error');
        res.end();
    }
});
module.exports = router;



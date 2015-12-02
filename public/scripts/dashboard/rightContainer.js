app.controller('rightController', function($scope) {
    $scope.timerSurface = [{champion: 'Rek\'Sai', timeName: 'flash', timeDur: 300}, {champion: 'Karma', timeName: 'flash', timeDur: 300}];
    $scope.activeTimer = '';
    $scope.activeChamp = '';
    $scope.activeTimerLength = '';
    $scope.activeTimerId = '';
    $scope.activeChampId = '';
    $scope.launched = false;
    //Timer clear tip
    $(document).ready(function(){
        $('.header').on('hover', function(){
            if($('.timer-tip').css('display') == 'block' && !$scope.launched){
                $('.timer-tip').fadeIn('slow');
                $scope.launched = true;
                setTimeout($('.timer-top').fadeOut('slow'), 6000);
            }
        });
    });

    $(document).ready(function() {
        if (annyang) {
            var commands = {
                'time *voiceInput': $scope.timerConstructor
            };

            annyang.addCommands(commands);
            annyang.start();
        }
    });
    $scope.timerConstructor = function(data) {
        var findParam = data.split(/[\s' ']+/);
        var firstString = findParam[0];
        var lastString = findParam[findParam.length - 1];
        var conLast = data.replace(firstString + ' ', '');
        var conFirst = data.replace(' ' + lastString, '');
        // EX: time karma flash
        if ($scope.isTimerParam(lastString) == true && $scope.isValidChamp(conFirst) == true) {
            $scope.initTimer();
            console.log('valid timer');
            annyang.resume();
            console.log($scope.timerSurface);
        }
        // EX: time flash karma
        else if ($scope.isTimerParam(firstString) == true && $scope.isValidChamp(conLast) == true) {
            $scope.initTimer();
            console.log('valid timer');
            annyang.resume();
            console.log($scope.timerSurface);
        } else { //Invalid timer or champion name
            console.log($scope.isValidChamp(conFirst));
            console.log(firstString);
            console.log(lastString);
            console.log(conFirst);
            console.log(conLast);
            console.log(data);
            console.log('invalid timer');
            console.log('-------------');

            annyang.resume();

        }
    };

    $scope.isTimerParam = function(str) {
        for (var i = 0; i < $scope.timerValues.length; i++) {
            if (str == $scope.timerValues[i].id) {
                $scope.activeTimer = $scope.timerValues[i].id;
                $scope.activeTimerLength = $scope.timerValues[i].duration;
                $scope.activeTimerId = $scope.timerValues[i].icon;
                console.log('isValidParam');
                return true;
            }
        }
        return false;
    };

    $scope.isValidChamp = function(str) {
        str.split(' ').join('');
        for (var i = 0; i < $scope.champion.length; i++) {
            if (str.toLowerCase() == $scope.champion[i].name.toLowerCase()) {
                $scope.activeChamp = $scope.champion[i].name;
                $scope.activeChampId = $scope.champion[i].icon;
                console.log('isValidChamp');
                return true;
            }
        }
        return false;
    };

    $scope.initTimer = function() {
        var timeName = $scope.activeTimer;
        var champ = $scope.activeChamp;
        var timeDur = $scope.activeTimerLength;
        var champId = $scope.activeChampId;
        var timerId = $scope.activeTimerId;
        console.log('initTimer');
        $scope.$apply(function () {
            $scope.timerSurface.push({champion: champ, timeName: timeName, timeDur: timeDur, champId: champId, timerId: timerId});
        });
    };

    $(document).ready(function() {
        (function theLoop(n) {
            setTimeout(function () {
                var listItem = $('.timer-instance-wrapper li');
                var listItemSpan = $('.timer-instance-wrapper li span');
                for (var i = 0; i < $scope.timerSurface.length; i++) {
                    if ($scope.timerSurface[i].timeDur > 0) {
                        var timerName = listItem.eq(i).text().split(' >> ').pop();
                        timerName = timerName.replace(/\s+/g, '');
                        var currentTimePerc = parseInt(listItem.eq(i).text()) / $scope.getTimeDur(timerName);
                        listItemSpan.eq(i).css('background-color', getColorForPercentage(currentTimePerc));
                        $scope.$apply(function () {
                            $scope.timerSurface[i].timeDur--;
                        })
                    }
                    else {
                        $scope.$apply(function () {
                            $scope.timerSurface.splice($scope.timerSurface[i], 1);
                        });
                    }

                }
                if (--n) {
                    theLoop(n);
                }
            }, 1000);
        })(Number.MAX_VALUE);
    });

        var percentColors = [
            { pct: 1.0, color: { r: 0, g: 153, b: 51 } },
            { pct: 0.0, color: { r: 179, g: 0, b: 0 } } ];

        var getColorForPercentage = function(pct) {
            for (var i = 1; i < percentColors.length - 1; i++) {
                if (pct < percentColors[i].pct) {
                    break;
                }
            }
            var lower = percentColors[i - 1];
            var upper = percentColors[i];
            var range = upper.pct - lower.pct;
            var rangePct = (pct - lower.pct) / range;
            var pctLower = 1 - rangePct;
            var pctUpper = rangePct;
            var color = {
                r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
                g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
                b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
            };
            return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
        };

    $scope.getTimeDur = function(id) {
        for (var i = 0; i < $scope.timerValues.length; i++) {
            if (id == $scope.timerValues[i].id) return $scope.timerValues[i].duration;
        }
        return false;
    };

    $scope.removeIndividualTimer = function(sec){
        $scope.timerSurface.splice(sec, 1);
    };

    $scope.clearTimers = function(){
        $scope.timerSurface = [];
    };

    $scope.timerValues = [{
        id: 'flash',
        duration: 300,
        icon: 4
    }, {
        id: 'teleport',
        duration: 300,
        icon: 12
    }, {
        id: 'heal',
        duration: 240,
        icon: 7
    }, {
        id: 'exhaust',
        duration: 210,
        icon: 3
    }, {
        id: 'ignite',
        duration: 210,
        icon: 14
    }, {
        id: 'barrier',
        duration: 210,
        icon: 21
    }, {
        id: 'cleanse',
        duration: 210,
        icon: 1
    }, {
        id: 'ghost',
        duration: 210,
        icon: 6
    } ];
    //create valid language reference to
    $scope.champion = [{
        id: '',
        name: 'Aatrox',
        icon: 266
    }, {
        id: '',
        name: 'Ahri',
        icon: 103
    }, {
        id: '',
        name: 'Akali',
        icon: 84
    }, {
        id: '',
        name: 'Alistar',
        icon: 12
    }, {
        id: '',
        name: 'Amumu',
        icon: 32
    }, {
        id: '',
        name: 'Anivia',
        icon: 34
    }, {
        id: '',
        name: 'Annie',
        icon: 1
    }, {
        id: '',
        name: 'Ashe',
        icon: 22
    }, {
        id: '',
        name: 'Azir',
        icon: 268
    }, {
        id: '',
        name: 'Bard',
        icon: 432
    }, {
        id: '',
        name: 'Blitzcrank',
        icon: 53
    }, {
        id: '',
        name: 'Brand',
        icon: 63
    }, {
        id: '',
        name: 'Braum',
        icon: 201
    }, {
        id: '',
        name: 'Caitlyn',
        icon: 51
    }, {
        id: '',
        name: 'Cassiopeia',
        icon: 69
    }, {
        id: '',
        name: 'Cho\'Gath',
        icon: 31
    }, {
        id: '',
        name: 'Corki',
        icon: 42
    }, {
        id: '',
        name: 'Darius',
        icon: 122
    }, {
        id: '',
        name: 'Diana',
        icon: 131
    }, {
        id: '',
        name: 'Dr. Mundo',
        icon: 36
    }, {
        id: '',
        name: 'Draven',
        icon: 199
    }, {
        id: '',
        name: 'Ekko',
        icon: 245
    }, {
        id: '',
        name: 'Elise',
        icon: 60
    }, {
        id: '',
        name: 'Evelynn',
        icon: 28
    }, {
        id: '',
        name: 'Ezreal',
        icon: 81
    }, {
        id: '',
        name: 'Fiddlesticks',
        icon: 9
    }, {
        id: '',
        name: 'Fiora',
        icon: 114
    }, {
        id: '',
        name: 'Fizz',
        icon: 105
    }, {
        id: '',
        name: 'Galio',
        icon: 3
    }, {
        id: '',
        name: 'Gangplank',
        icon: 41
    }, {
        id: '',
        name: 'Garen',
        icon: 86
    }, {
        id: '',
        name: 'Gnar',
        icon: 150
    }, {
        id: '',
        name: 'Gragas',
        icon: 79
    }, {
        id: '',
        name: 'Graves',
        icon: 104
    }, {
        id: '',
        name: 'Hecarim',
        icon: 120
    }, {
        id: '',
        name: 'Heimerdinger',
        icon: 74
    }, {
        id: '',
        name: 'Illaoi',
        icon: 420
    }, {
        id: '',
        name: 'Irelia',
        icon: 39
    }, {
        id: '',
        name: 'Janna',
        icon: 40
    }, {
        id: '',
        name: 'Jarvan IV',
        icon: 59
    }, {
        id: '',
        name: 'Jax',
        icon: 24
    }, {
        id: '',
        name: 'Jayce',
        icon: 126
    }, {
        id: '',
        name: 'Jinx',
        icon: 222
    }, {
        id: '',
        name: 'Kalista',
        icon: 429
    }, {
        id: '',
        name: 'Karma',
        icon: 43
    }, {
        id: '',
        name: 'Karthus',
        icon: 30
    }, {
        id: '',
        name: 'Kassadin',
        icon: 38
    }, {
        id: '',
        name: 'Katarina',
        icon: 55
    }, {
        id: '',
        name: 'Kayle',
        icon: 10
    }, {
        id: '',
        name: 'Kennen',
        icon: 85
    }, {
        id: '',
        name: 'Kha\'Zix',
        icon: 121
    }, {
        id: '',
        name: 'Kindred',
        icon: 203
    }, {
        id: '',
        name: 'Kog\'Maw',
        icon: 96
    }, {
        id: '',
        name: 'LeBlanc',
        icon: 7
    }, {
        id: '',
        name: 'Lee Sin',
        icon: 64
    }, {
        id: '',
        name: 'Leona',
        icon: 89
    }, {
        id: '',
        name: 'Lissandra',
        icon: 127
    }, {
        id: '',
        name: 'Lucian',
        icon: 236
    }, {
        id: '',
        name: 'Lulu',
        icon: 117
    }, {
        id: '',
        name: 'Lux',
        icon: 99
    }, {
        id: '',
        name: 'Malphite',
        icon: 54
    }, {
        id: '',
        name: 'Malzahar',
        icon: 90
    }, {
        id: '',
        name: 'Maoki',
        icon: 57
    }, {
        id: '',
        name: 'Master Yi',
        icon: 90
    }, {
        id: '',
        name: 'Miss Fortune',
        icon: 21
    }, {
        id: '',
        name: 'Mordekaiser',
        icon: 82
    }, {
        id: '',
        name: 'Morgana',
        icon: 25
    }, {
        id: '',
        name: 'Nami',
        icon: 267
    }, {
        id: '',
        name: 'Nasus',
        icon: 75
    }, {
        id: '',
        name: 'Nautilus',
        icon: 111
    }, {
        id: '',
        name: 'Nidalee',
        icon: 76
    }, {
        id: '',
        name: 'Nocturne',
        icon: 56
    }, {
        id: '',
        name: 'Nunu',
        icon: 20
    }, {
        id: '',
        name: 'Olaf',
        icon: 2
    }, {
        id: '',
        name: 'Orianna',
        icon: 61
    }, {
        id: '',
        name: 'Pantheon',
        icon: 80
    }, {
        id: '',
        name: 'Poppy',
        icon: 78
    }, {
        id: '',
        name: 'Quinn',
        icon: 133
    }, {
        id: '',
        name: 'Rammus',
        icon: 33
    }, {
        id: '',
        name: 'Rek\'Sai',
        icon: 421
    }, {
        id: '',
        name: 'Renekton',
        icon: 58
    }, {
        id: '',
        name: 'Rengar',
        icon: 107
    }, {
        id: '',
        name: 'Riven',
        icon: 92
    }, {
        id: '',
        name: 'Rumble',
        icon: 68
    }, {
        id: '',
        name: 'Ryze',
        icon: 13
    }, {
        id: '',
        name: 'Sejuani',
        icon: 113
    }, {
        id: '',
        name: 'Shaco',
        icon: 35
    }, {
        id: '',
        name: 'Shen',
        icon: 98
    }, {
        id: '',
        name: 'Shyvanna',
        icon: 102
    }, {
        id: '',
        name: 'Singed',
        icon: 27
    }, {
        id: '',
        name: 'Sion',
        icon: 14
    }, {
        id: '',
        name: 'Sivir',
        icon: 15
    }, {
        id: '',
        name: 'Skarner',
        icon: 72
    }, {
        id: '',
        name: 'Sona',
        icon: 37
    }, {
        id: '',
        name: 'Soraka',
        icon: 16
    }, {
        id: '',
        name: 'Swain',
        icon: 50
    }, {
        id: '',
        name: 'Syndra',
        icon: 134
    }, {
        id: '',
        name: 'Tahm Kench',
        icon: 223
    }, {
        id: '',
        name: 'Talon',
        icon: 91
    }, {
        id: '',
        name: 'Taric',
        icon: 44
    }, {
        id: '',
        name: 'Teemo',
        icon: 17
    }, {
        id: '',
        name: 'Thresh',
        icon: 412
    }, {
        id: '',
        name: 'Tristana',
        icon: 18
    }, {
        id: '',
        name: 'Trundle',
        icon: 48
    }, {
        id: '',
        name: 'Tryndamere',
        icon: 23
    }, {
        id: '',
        name: 'Twisted Fate',
        icon: 4
    }, {
        id: '',
        name: 'Twitch',
        icon: 29
    }, {
        id: '',
        name: 'Udyr',
        icon: 77
    }, {
        id: '',
        name: 'Urgot',
        icon: 6
    }, {
        id: '',
        name: 'Varus',
        icon: 110
    }, {
        id: '',
        name: 'Vayne',
        icon: 67
    }, {
        id: '',
        name: 'Veigar',
        icon: 45
    }, {
        id: '',
        name: 'Vel\'Koz',
        icon: 161
    }, {
        id: '',
        name: 'Vi',
        icon: 254
    }, {
        id: '',
        name: 'Viktor',
        icon: 112
    }, {
        id: '',
        name: 'Vladimir',
        icon: 8
    }, {
        id: '',
        name: 'Volibear',
        icon: 106
    }, {
        id: '',
        name: 'Warwick',
        icon: 19
    }, {
        id: '',
        name: 'Wukong',
        icon: 62
    }, {
        id: '',
        name: 'Xerath',
        icon: 101
    }, {
        id: '',
        name: 'Xin Zhao',
        icon: 5
    }, {
        id: '',
        name: 'Yasuo',
        icon: 157
    }, {
        id: '',
        name: 'Yorick',
        icon: 83
    }, {
        id: '',
        name: 'Zac',
        icon: 154
    }, {
        id: '',
        name: 'Zed',
        icon: 238
    }, {
        id: '',
        name: 'Ziggs',
        icon: 115
    }, {
        id: '',
        name: 'Zilean',
        icon: 26
    }, {
        id: '',
        name: 'Zyra',
        icon: 143
    }];
});

//Check for left/right scuttle
//Check for inhib/position/team

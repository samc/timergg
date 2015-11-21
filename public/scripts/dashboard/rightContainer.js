app.controller('rightController', function($scope) {
    $scope.timerSurface = {};
    $scope.activeEnemies = {}; //5v5 Riot API call
    $scope.activeTimer = '';
    $scope.activeChamp = '';
    $scope.maxChampCount = '';
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
        $('.header').on('click', function(e){
            e.preventDefault();
            $scope.timerSurface = {}
        });
    });

    $(document).ready(function() {
        if (annyang) {
            var commands = {
                '*voiceInput': $scope.timerConstructor
            };

            annyang.addComands(commands);
            annyang.start();
        }
    });
    $scope.timerConstructor = function(data) {
        var findParam = data.split(/[\s' ']+/);
        var firstString = findParam[0];
        var lastString = findParam[findParam.length - 1];
        var conFirst = data.replace(firstString + ' ', '');
        var conLast = data.replace(' ' + lastString);
        try {
            if ($scope.isTimerParam(firstString) && $scope.isValidChamp(conFirst)) {
                $scope.initTimer();
            } else if ($scope.isTimerParam(lastString) && $scope.isValidChamp(conLast)) {
                $scope.initTimer();
            }
        } catch (err) {
            //Invalid timer or champion name
        }
    };

    $scope.isTimerParam = function(str) {
        for (var i = 0; i < $scope.timerValues.length; i++) {
            if ($scope.timerValues[i].id == str) {
                $scope.activeTimer = timerValues[i].timer;
                return true;
            } else if (i > $scope.timerValues){
                break;
            }
        };
    };

    $scope.isValidChamp = function(str) {
        for (var i = 0; i < $scope.timerValues.length; i++) {
            if ($scope.champion[i].id == str) {
                $scope.activeChamp = $scope.champion[i].name;
                return true;
            } else if (i > $scope.maxChampCount) {
                break;
            }
        }
    };

    $scope.initTimer = function() {
        var time = $scope.activeTimer;
        var champ = $scope.activeChamp;
        $scope.timerSurface.push({
            champion: champ,
            timer: time
        });
    };

    $(document).ready(function(){
        while($scope.timerSurface.length > 0) {
            for (var timer in $scope.timerSurface) {
                if (timer.timer.length > -1) timer.timer--;
                else {
                    $scope.timerSurface.splice(timer, 1);
                    return false;
                }
            }
        }
    });


    $scope.clearTimers = function(){
        $scope.timerSurface = {};
    };

    $scope.timerValues = [{
        id: 'flash',
        timer: 300,
    }, {
        id: 'teleport',
        timer: 300,
    }, {
        id: 'heal',
        timer: 300,
    }, {
        id: 'exhaust',
        timer: 300,
    }, {
        id: 'ignite',
        timer: 300,
    }, {
        id: 'barrier',
        timer: 300,
    }, {
        id: 'cleanse',
        timer: 300,
    }, {
        id: 'ghost',
        timer: 300,
    }, {
        id: 'inhibitor',
        timer: 300,
    }, {
        id: 'barrier',
        timer: 300,
    }, ];
    //create valid language reference to
    $scope.champion = [{
        id: '',
        name: 'Aatrox',
    }, {
        id: '',
        name: 'Ahri',
    }, {
        id: '',
        name: 'Akali',
    }, {
        id: '',
        name: 'Alistar',
    }, {
        id: '',
        name: 'Amumu',
    }, {
        id: '',
        name: 'Anivia',
    }, {
        id: '',
        name: 'Annie',
    }, {
        id: '',
        name: 'Ashe',
    }, {
        id: '',
        name: 'Blitzcrank',
    }, {
        id: '',
        name: 'Brand',
    }, {
        id: '',
        name: 'Caitlyn',
    }, {
        id: '',
        name: 'Cassiopeia',
    }, {
        id: '',
        name: 'Cho\'Gath',
    }, {
        id: '',
        name: 'Corki',
    }, {
        id: '',
        name: 'Mundo',
    }, {
        id: '',
        name: 'Draven',
    }, {
        id: '',
        name: 'Elise',
    }, {
        id: '',
        name: 'Evelynn',
    }, {
        id: '',
        name: 'Ezreal',
    }, {
        id: '',
        name: 'Fiddlesticks',
    }, {
        id: '',
        name: 'Fiora',
    }, {
        id: '',
        name: 'Fizz',
    }, {
        id: '',
        name: 'Galio',
    }, {
        id: '',
        name: 'Gangplank',
    }, {
        id: '',
        name: 'Garen',
    }, {
        id: '',
        name: 'Gragas',
    }, {
        id: '',
        name: 'Graves',
    }, {
        id: '',
        name: 'Hecarim',
    }, {
        id: '',
        name: 'Janna',
    }, {
        id: '',
        name: 'Jarvan IV',
    }, {
        id: '',
        name: 'Jax',
    }, {
        id: '',
        name: 'Jayce',
    }, {
        id: '',
        name: 'Kalista',
    }, {
        id: '',
        name: 'Karma',
    }, {
        id: '',
        name: 'Karthus',
    }, {
        id: '',
        name: 'Kassadin',
    }, {
        id: '',
        name: 'Katarina',
    }, {
        id: '',
        name: 'Kayle',
    }, {
        id: '',
        name: 'Kennen',
    }, {
        id: '',
        name: 'Kha\'Zix',
    }, {
        id: '',
        name: 'Kog\'Maw',
    }, {
        id: '',
        name: 'LeBlanc',
    }, {
        id: '',
        name: 'Lee Sin',
    }, {
        id: '',
        name: 'Lulu',
    }, {
        id: '',
        name: 'Lux',
    }, {
        id: '',
        name: 'Malphite',
    }, {
        id: '',
        name: 'Malzahar',
    }, {
        id: '',
        name: 'Maoki',
    }, {
        id: '',
        name: 'Master Yi',
    }, {
        id: '',
        name: 'Miss Fortune',
    }, {
        id: '',
        name: 'Mordekaiser',
    }, {
        id: '',
        name: 'Morgana',
    }, {
        id: '',
        name: 'Nami',
    }, {
        id: '',
        name: 'Nasus',
    }, {
        id: '',
        name: 'Nautilus',
    }, {
        id: '',
        name: 'Nidalee',
    }, {
        id: '',
        name: 'Nocturne',
    }, {
        id: '',
        name: 'Orianna',
    }, {
        id: '',
        name: 'Pantheon',
    }, {
        id: '',
        name: 'Poppy',
    }, {
        id: '',
        name: 'Quinn',
    }, {
        id: '',
        name: 'Rammus',
    }, {
        id: '',
        name: 'Renekton',
    }, {
        id: '',
        name: 'Rengar',
    }, {
        id: '',
        name: 'Riven',
    }, {
        id: '',
        name: 'Rumble',
    }, {
        id: '',
        name: 'Ryze',
    }, {
        id: '',
        name: 'Sejuani',
    }, {
        id: '',
        name: 'Shaco',
    }, {
        id: '',
        name: 'Shen',
    }, {
        id: '',
        name: 'Shyvanna',
    }, {
        id: '',
        name: 'Sivir',
    }, {
        id: '',
        name: 'Skarner',
    }, {
        id: '',
        name: 'Sona',
    }, {
        id: '',
        name: 'Soraka',
    }, {
        id: '',
        name: 'Swain',
    }, {
        id: '',
        name: 'Syndra',
    }, {
        id: '',
        name: 'Tahm Kench',
    }, {
        id: '',
        name: 'Talon',
    }, {
        id: '',
        name: 'Taric',
    }, {
        id: '',
        name: 'Teemo',
    }, {
        id: '',
        name: 'Thresh',
    }, {
        id: '',
        name: 'Tristana',
    }, {
        id: '',
        name: 'Trundle',
    }, {
        id: '',
        name: 'Tryndamere',
    }, {
        id: '',
        name: 'Twisted Fate',
    }, {
        id: '',
        name: 'Urgot',
    }, {
        id: '',
        name: 'Varus',
    }, {
        id: '',
        name: 'Vayne',
    }, {
        id: '',
        name: 'Veigar',
    }, {
        id: '',
        name: 'Vi',
    }, {
        id: '',
        name: 'Viktor',
    }, {
        id: '',
        name: 'Vladimir',
    }, {
        id: '',
        name: 'Volibear',
    }, {
        id: '',
        name: 'Warwick',
    }, {
        id: '',
        name: 'Wukong',
    }, {
        id: '',
        name: 'Xin Xao',
    }, {
        id: '',
        name: 'Yorick',
    }, {
        id: '',
        name: 'Zac',
    }, {
        id: '',
        name: 'Zilean',
    }, {
        id: '',
        name: 'Zyra',
    }];
});

//Check for left/right scuttle
//Check for inhib/position/team

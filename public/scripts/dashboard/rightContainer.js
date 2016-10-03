var data = null;

app.controller('rightController', function($scope) {
    $scope.currentChampionIdRef = '';
    $scope.timerSurface = [];
    $scope.activeTimer = '';
    $scope.activeChamp = '';
    $scope.activeTimerLength = '';
    $scope.activeTimerLengthMax = '';
    $scope.activeTimerId = '';
    $scope.activeChampId = '';
    $scope.noMic = false;
    $scope.launched = false;
    $scope.activeChampions = [];
    $scope.tryTimerReference = true;
    $scope.askTimer = '';
    $scope.askTimerDur = '';
    $scope.askChamp = '';
    //listen for timer creation in timer surface and initialize dashboard cool down
    $(document).arrive('.tmr', function () {
        var el = $(this);
        var timerId = el.attr('id');
        var middleSSId = $('.' + timerId);
        middleSSId.trigger('voiceTrigger');
    });

    //initiate annyang voice-rec && saved references
    $(document).ready(setTimeout(function () {

        for (var i = 0; i < $scope.activeChampions.length; i++) {
            var champId = $scope.activeChampions[i].icon;
            if (localStorage.getItem(champId) != undefined) {
                var refList = localStorage.getItem(champId).split(',');
                for (var ii = 0; ii < refList.length; ii++) {
                    $scope.activeChampions[i]['id'].push(refList[ii]);
                }
            }
        }
        $scope.voiceRecInit();
    }), 1);

    $scope.voiceRecInit = function () {
        if (annyang) {
            annyang.debug([newState = true]);
            var commands = {
                'time *voiceInput': $scope.timerConstructor,
                'prime *voiceInput': $scope.timerConstructor,
                'turn *voiceInput': $scope.timerConstructor,
                'turned *voiceInput': $scope.timerConstructor,
                'turning *voiceInput': $scope.timerConstructor,
                'I\'m *voiceInput': $scope.timerConstructor,
                'timeless *voiceInput': $scope.timerConstructor,
                'timer *voiceInput': $scope.timerConstructor,
                'times *voiceInput': $scope.timerConstructor,
                'distortion :champion': $scope.distortionToggleId,
                'lucidity :champion': $scope.lucidityToggleId,
                'reminder set :time seconds': $scope.setReminderTime,
                'ticker set :time seconds': $scope.setTickerInterval,
                'toggle :extra': $scope.extraToggle
            };

            annyang.addCallback('errorPermissionDenied', function () {
                $scope.noMic = true;
            });
            annyang.addCallback('errorPermissionBlocked', function () {
                $scope.noMic = true;
            });
            //check for user recording champ ref
            annyang.addCallback('resultNoMatch', function (refs) {
                if ($scope.currentChampionIdRef != '') {
                    if (localStorage.getItem($scope.currentChampionIdRef) === null) localStorage.setItem($scope.currentChampionIdRef, refs); else {
                        var currentRefs = localStorage.getItem($scope.currentChampionIdRef);
                        currentRefs = currentRefs.split(',');

                        for (var ref = 0; ref < refs.length; ref++) {
                            if (refs[ref] == 'clear' || refs[ref] == ' clear') {
                                localStorage.setItem($scope.currentChampionIdRef, []);
                                var msg = new SpeechSynthesisUtterance('Aliases successfully cleared');
                                $scope.timerWarning(msg);
                                $scope.currentChampionIdRef = '';
                                $('.player-sector-champ-icon').removeClass('champ-icon-recording');
                                return;
                            }
                            currentRefs.push(refs[ref]);
                        }
                        localStorage.setItem($scope.currentChampionIdRef, currentRefs);
                    }
                    for (var i = 0; i < $scope.activeChampions.length; i++) {
                        if ($scope.currentChampionIdRef == $scope.activeChampions[i].icon) {

                            for (var ii = 0; ii < refs.length; ii++) {
                                $scope.activeChampions[i]['id'].push(refs[ii]);
                            }

                            var champRefName = $scope.activeChampions[i].name;
                            $('.player-sector-champ-icon').removeClass('champ-icon-recording');
                            var msg = new SpeechSynthesisUtterance(champRefName + ' reference created!');
                            $scope.timerWarning(msg);
                            break;
                        }
                    }
                    $scope.currentChampionIdRef = '';
                }
            });

            annyang.addCallback('resultNoMatch', function (phrases) {
                for (var i = 0; i < phrases.length; i++) {
                    var phrase = phrases[i];
                    if (phrase.charAt(0) === ' ') phrase = phrase.substr(1);
                    if ($scope.timerConstructor(phrase))break;
                }
            });

            annyang.addCallback('resultMatch', function (u, c, phrases) {
                for (var i = 0; i < phrases.length; i++) {
                    var phrase = phrases[i];
                    if (phrase.charAt(0) === ' ') phrase = phrase.substr(1);

                    if ($scope.timerConstructor(phrase))break;
                }
            });


            annyang.addCommands(commands);
            annyang.start();
        } else {
            $('.unsupported').show();
        }

    };
    $scope.setReminderTime = function (time) {
        if (parseInt(time) > 0 && parseInt(time) < 11) $('.voice-assist-reminder').data('reminder', time);
        $('.voice-assist-reminder').val(time);
    };
    $scope.setTickerInterval = function (time) {
        time = $scope.detectNumber(time);
        if (parseInt(time) > 0 && parseInt(time) < 11) $('.cs-ticker-input').val(time + 's');
    };
    $scope.extraToggle = function (extra) {
        var homophones = [
            ['#slider5', 'ally', 'allies', 'li'],
            ['#slider6', 'ticker', 'tickler'],
            ['#slider7', 'display'],
            ['#slider8', 'cw', 'cannon', 'wave']
        ];
        for (var i = 0; i <= 3; ++i) {
            if (homophones[i].indexOf(extra.toLowerCase()) > -1) {
                var extraToToggleStr = homophones[i][0];
                var extraToToggle = $(extraToToggleStr);
                extraToToggle.prop("checked", !extraToToggle.prop("checked"));
                $(extraToToggle).trigger('change');
                return;
            }
        }
    };

    //readjust tse-scroll container
    $scope.initiateScrollRight = function () {
        $('.right-wrap').TrackpadScrollEmulator();
    };
    $(document).ready(function () {
        $scope.$apply(function () {
            $scope.initiateScrollRight();
        });
    });
    $scope.detectNumber = function (data) {
        var homophones = [
            [], // placeholder
            ['one'],
            ['two', 'to'],
            ['three'],
            ['four', 'for', 'fore'],
            ['five', 'v'],
            ['six', 'sex', 'sic'],
            ['seven'],
            ['eight', 'ate', 'eat'],
            ['nine', 'none'],
            ['ten', 'tin', 'ton', 'tan']];
        for (var i = 1; i <= 10; ++i) {
            if (homophones[i].indexOf(data) > -1) {
                return i.toString();
            }
        }
        return data;
    };

    //distortion voice toggle
    $scope.distortionToggleId = function (data) {

        //champ name conversion

        data = $scope.detectNumber(data);
        var booleanId;
        var champId;
        var champName;
        var enabled;
        var disabled;
        var number = /^[1-910]+$/;
        var invalid = new SpeechSynthesisUtterance('invalid champion');
        if (data.match(number)) {
            booleanId = $('.player-sector-distortion').eq(data - 1);
            champId = booleanId.data('champid');
            toggleDistortion(booleanId);
            $scope.champConversion(parseInt(champId));
            champName = $scope.activeChamp;
            enabled = new SpeechSynthesisUtterance(champName + ' distortion enabled');
            disabled = new SpeechSynthesisUtterance(champName + ' distortion disabled');
            if (booleanId.data('distortion')) $scope.timerWarning(enabled); else $scope.timerWarning(disabled);
        } else if ($scope.isValidChamp(data)) {
            champId = $scope.activeChampId;
            champName = $scope.activeChamp;
            var booleanName = $('.distortion-' + champId);
            if (booleanName.length) {
                toggleDistortion(booleanName);
                enabled = new SpeechSynthesisUtterance(champName + ' distortion enabled');
                disabled = new SpeechSynthesisUtterance(champName + ' distortion disabled');
                if (booleanName.data('distortion')) $scope.timerWarning(enabled); else $scope.timerWarning(disabled);
            } else $scope.timerWarning(invalid);
        } else {
            $scope.timerWarning(invalid);
        }
    };

    $scope.lucidityToggleId = function (data) {

        //champ name conversion
        data = $scope.detectNumber(data);
        var booleanId;
        var champId;
        var champName;
        var enabled;
        var disabled;
        var number = /^[1-910]+$/;
        var invalid = new SpeechSynthesisUtterance('invalid champion');
        if (data.match(number)) {
            booleanId = $('.player-sector-lucidity').eq(data - 1);
            champId = booleanId.data('champid');
            toggleLucidity(booleanId);
            $scope.champConversion(parseInt(champId));
            champName = $scope.activeChamp;
            enabled = new SpeechSynthesisUtterance(champName + ' lucidity enabled');
            disabled = new SpeechSynthesisUtterance(champName + ' lucidity disabled');
            if (booleanId.data('lucidity')) $scope.timerWarning(enabled); else $scope.timerWarning(disabled);
        } else if ($scope.isValidChamp(data)) {
            champId = $scope.activeChampId;
            champName = $scope.activeChamp;
            var booleanName = $('.lucidity-' + champId);
            if (booleanName.length) {
                toggleLucidity(booleanName);
                enabled = new SpeechSynthesisUtterance(champName + ' lucidity enabled');
                disabled = new SpeechSynthesisUtterance(champName + ' lucidity disabled');
                if (booleanName.data('lucidity')) $scope.timerWarning(enabled); else $scope.timerWarning(disabled);
            } else $scope.timerWarning(invalid);
        } else {
            $scope.timerWarning(invalid);
        }
    };

    $scope.isActiveTimer = function () {
        var champId = $scope.activeChampId;
        var spellId = $scope.activeTimerId;
        return ($('.' + spellId + '-' + champId).length);
    };

    $scope.timerAlreadyExists = function () {
        for (var i = 0; i < $scope.timerSurface.length; i++) {
            if ($scope.timerSurface[i].timerId == $scope.activeTimerId && $scope.timerSurface[i].champId == $scope.activeChampId) {
                $scope.askTimer = $scope.timerSurface[i].timeName;
                $scope.askTimerDur = $scope.timerSurface[i].timeDur - 3;
                $scope.askChamp = $scope.timerSurface[i].champion;
                return false;
            }
        }
        return true;
    };

    $scope.timerConstructor = function(data) {

        var findParam = data.split(/[\s' ']+/);
        var firstString = findParam[0];
        var lastString = findParam[findParam.length - 1];
        var conLast = data.replace(firstString + ' ', '');
        var conFirst = data.replace(' ' + lastString, '');

        //---Summoner Number Constructor---START
        conFirst = $scope.detectNumber(conFirst);
        conLast = $scope.detectNumber(conLast);

        var champId;
        var booleanId;
        var msg;
        var number = /^[1-910]+$/;
        if (conFirst.match(number)) {
            booleanId = $('.player-sector-distortion').eq(conFirst - 1);
            champId = booleanId.data('champid');
            $scope.champConversion(parseInt(champId));
            conFirst = $scope.activeChamp;
        }
        else if (conLast.match(number)) {
            booleanId = $('.player-sector-distortion').eq(conLast - 1);
            champId = booleanId.data('champid');
            $scope.champConversion(parseInt(champId));
            conLast = $scope.activeChamp;
        }
        //---Summoner Number Constructor---END

        // EX: time karma flash
        if ($scope.isTimerParam(lastString) === true && $scope.isValidChamp(conFirst) === true) {
            if ($scope.timerAlreadyExists()) {
                if ($scope.isActiveTimer()) { //check that timer is spell 1 or spell 2
                    $scope.initTimer();
                    return true;
                } else {
                    msg = new SpeechSynthesisUtterance('invalid timer');
                    $scope.timerWarning(msg);
                    return true;
                }
            } else {
                msg = new SpeechSynthesisUtterance($scope.askChamp + ' ' + $scope.askTimer + ' up in ' + $scope.askTimerDur + ' seconds');
                $scope.timerWarning(msg);
                return true;
            }
        }
        // EX: time flash karma
        else if ($scope.isTimerParam(firstString) === true && $scope.isValidChamp(conLast) === true) {
            if ($scope.timerAlreadyExists()) {
                if ($scope.isActiveTimer()) { //check that timer is spell 1 or spell 2
                    $scope.initTimer();
                    return true;
                } else {
                    msg = new SpeechSynthesisUtterance('invalid timer');
                    $scope.timerWarning(msg);
                    return true;
                }
            } else {
                msg = new SpeechSynthesisUtterance($scope.askChamp + ' ' + $scope.askTimer + ' up in ' + $scope.askTimerDur + ' seconds');
                $scope.timerWarning(msg);
                return true;
            }
        }
        //objective check
        else if ($scope.isObjective(firstString, conLast) || $scope.isObjective(lastString, conFirst)) {
            $scope.activeTimerId = '';
            $scope.activeTimer = '';
            $scope.initTimer();
            return true;
        }
        else {
            //Invalid timer or champion name
            return false;
        }
    };

    $scope.isTimerParam = function(str) {
        str = str.toLowerCase();
        for (var i = 0; i < $scope.summonerSpells.length; i++) {
            if (str == $scope.summonerSpells[i].id) {
                $scope.activeTimer = $scope.summonerSpells[i].id;
                $scope.activeTimerLength = $scope.summonerSpells[i].duration;
                $scope.activeTimerLengthMax = $scope.summonerSpells[i].duration;
                $scope.activeTimerId = $scope.summonerSpells[i].icon;
                return true;
            }
            for (var ii = 0; ii < $scope.summonerSpells[i].refr.length; ii++) {
                if (str.toLowerCase() == $scope.summonerSpells[i].refr[ii]) {
                    $scope.activeTimer = $scope.summonerSpells[i].id;
                    $scope.activeTimerId = $scope.summonerSpells[i].icon;
                    $scope.activeTimerLength = $scope.summonerSpells[i].duration;
                    $scope.activeTimerLengthMax = $scope.summonerSpells[i].duration;
                    return true;
                }
            }
        }
        return false;
    };

    $scope.teamConstructor = function (arr) {
        for (var i = 0; i < arr.length; i++) {
            var champId = arr[i].championId;
            $scope.champion.forEach(function (el) {
                if (el.icon == champId) {
                    $scope.activeChampions.push(el);
                }
            })
        }
    };


    var allyTeam = $("#uidAlly").html();
    var enemyTeam = $('#uidEnemy').html();

    allyTeam = JSON.parse(allyTeam);
    enemyTeam = JSON.parse(enemyTeam);


    var allyTeamId = parseInt(allyTeam[0].teamId);
    var enemyTeamId;
    var targetTeamId;
    if (allyTeamId == 100) enemyTeamId = 200; else enemyTeamId = 100;

    $scope.isObjective = function (str, dir) {
        str = str.toLowerCase();
        dir = dir.toLowerCase();
        if (str == 'him' || str == 'his' || str == 'hip') {
            str = 'inhibitor';
            dir = dir.replace(' in', '');
        }
        if (str == 'buff' && dir.length > 0) {
            str = dir.split(' ').pop();
            dir = dir.split(' ').shift();
        }
        for (var i = 0; i < $scope.objectives.length; i++) {
            for (var ii = 0; ii < $scope.objectives[i].refr.length; ii++) {
                if (str.toLowerCase() == $scope.objectives[i].refr[ii]) {
                    if ($scope.objectives[i].jungle == true && dir.length > 0) {
                        var enemy = ['enemy', 'anime', 'stop', 'stops', 'and any', 'and me', 'and amir', 'enemy red'];
                        var ally = ['ally', 'li', 'a lie', 'i like', 'le', 'away', 'al i'];
                        if (enemy.indexOf(dir.toLowerCase()) != -1) dir = 'Enemy';
                        if (ally.indexOf(dir.toLowerCase()) != -1) dir = 'Ally';
                        if (dir == 'Ally' || dir == 'Enemy') {
                            $scope.activeTimerLength = $scope.objectives[i].duration;
                            $scope.activeTimerLengthMax = $scope.objectives[i].duration;
                            $scope.activeChamp = dir + ' ' + $scope.objectives[i].id;
                            $scope.activeChampId = $scope.objectives[i].icon;
                            return true;
                        }
                    }
                    if ($scope.objectives[i].dynamic == true && dir.length > 0) {
                        var dirSplit = dir.split(' ');
                        for (var iii = 0; iii < dirSplit.length; iii++) {
                            var lane = dirSplit[iii].toLowerCase();
                            var top = ['tops', 'to', 'stop', 'stops'];
                            var mid = ['middle', 'midst', 'in', 'with'];
                            var bot = ['but', 'bottom', 'bots', 'bought'];
                            if (top.indexOf(lane) != -1) lane = 'top';
                            if (bot.indexOf(lane) != -1) lane = 'bot';
                            if (mid.indexOf(lane) != -1) lane = 'mid';
                            for (var iiii = 0; iiii < $scope.objectives[i].lane.length; iiii++) {
                                if ($scope.objectives[i].lane[iiii].toLowerCase() == lane) {
                                    if (dirSplit.length == 2) {
                                        var laneIdx = dirSplit.indexOf(dirSplit[iii]);
                                        dirSplit.splice(laneIdx, 1);
                                        for (var n = 0; n < $scope.objectives[i].relation.length; n++) {
                                            for (var nn = 0; nn < $scope.objectives[i].relation[n].refr.length; nn++) {
                                                if (dirSplit[0].toLowerCase() == $scope.objectives[i].relation[n].refr[nn]) {
                                                    if ($scope.objectives[i].relation[n].id == 'Ally') targetTeamId = allyTeamId; else targetTeamId = enemyTeamId;
                                                    $scope.activeTimerLength = $scope.objectives[i].duration;
                                                    $scope.activeTimerLengthMax = $scope.objectives[i].duration;
                                                    $scope.activeChamp = $scope.objectives[i].lane[iiii] + ' ' + $scope.objectives[i].relation[n].id + ' ' + $scope.objectives[i].id;
                                                    $scope.activeChampId = targetTeamId + 1000;
                                                    return true;
                                                }
                                            }
                                        }
                                    } else if (dirSplit.length == 1) {
                                        $scope.activeTimerLength = $scope.objectives[i].duration;
                                        $scope.activeTimerLengthMax = $scope.objectives[i].duration;
                                        $scope.activeChamp = $scope.objectives[i].lane[iiii] + ' ' + $scope.objectives[i].id;
                                        $scope.activeChampId = $scope.objectives[i].icon;
                                        return true;
                                    }
                                }
                            }
                        }
                    } else if (str == 'dragon' || str == 'baron' || str == 'drake' || str == 'herald') {
                        $scope.activeTimerLength = $scope.objectives[i].duration;
                        $scope.activeTimerLengthMax = $scope.objectives[i].duration;
                        $scope.activeChamp = $scope.objectives[i].id;
                        $scope.activeChampId = $scope.objectives[i].icon;
                        return true;
                    }
                }
            }
        }
        return false;
    };

    $(document).ready(function () {
        $scope.teamConstructor(enemyTeam);
        $scope.teamConstructor(allyTeam);
        var tutName = $scope.activeChampions[1].name;
        $('.strong-green-starter').text(tutName);
        $('.map-dot').click(function () {
            $scope.activeTimer = '';
            $scope.activeTimerId = '';
            var params = $(this).attr('class').split(' ');
            var lane = params[2].split('-').shift();
            if (params[1] == 'blue') {
                if (allyTeamId == 100) {
                    $scope.isObjective('inhibitor', 'ally ' + lane);
                    $scope.initTimer();
                    annyang.resume();
                } else {
                    $scope.isObjective('inhibitor', 'enemy ' + lane);
                    $scope.initTimer();
                    annyang.resume();
                }
            }
            else if (params[1] == 'red') {
                if (allyTeamId == 100) {
                    $scope.isObjective('inhibitor', 'enemy ' + lane);
                    $scope.initTimer();
                    annyang.resume();
                } else {
                    $scope.isObjective('inhibitor', 'ally ' + lane);
                    $scope.initTimer();
                    annyang.resume();
                }
            }
            else if (params[1] == 'scuttle') {
                var scuttlePos = params[2].split('-').shift();
                $scope.isObjective('scuttle', scuttlePos);
                $scope.initTimer();
                annyang.resume();
            }
            else {
                var monster = params[2];
                $scope.isObjective(monster, '');
                $scope.initTimer();
                annyang.resume();
            }
        });
    });


    $scope.isValidChamp = function(str) {
        for (var i = 0; i < $scope.activeChampions.length; i++) {
            if (str.toLowerCase() == $scope.activeChampions[i].name.toLowerCase()) {
                $scope.activeChamp = $scope.activeChampions[i].name;
                $scope.activeChampId = $scope.activeChampions[i].icon;
                return true;
            }
            for (var ii = 0; ii < $scope.activeChampions[i].id.length; ii++) {
                if (str.toLowerCase() == $scope.activeChampions[i].id[ii]) {
                    $scope.activeChamp = $scope.activeChampions[i].name;
                    $scope.activeChampId = $scope.activeChampions[i].icon;
                    return true;
                }
            }
        }
        return false;
    };

    $scope.ssConversion = function (id) {
        for (var i = 0; i < $scope.summonerSpells.length; i++) {
            if (id == $scope.summonerSpells[i].icon) {
                $scope.activeTimer = $scope.summonerSpells[i].id;
                $scope.activeTimerId = $scope.summonerSpells[i].icon;
                $scope.activeTimerLength = $scope.summonerSpells[i].duration;
                $scope.activeTimerLengthMax = $scope.summonerSpells[i].duration;
                return true;
            }
        }
        return false;
    };

    $scope.champConversion = function (id) {
        for (var i = 0; i < $scope.activeChampions.length; i++) {
            if (id == $scope.activeChampions[i].icon) {
                $scope.activeChamp = $scope.activeChampions[i].name;
                $scope.activeChampId = $scope.activeChampions[i].icon;
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
        var timeDurMax = $scope.activeTimerLengthMax;

        var msg = new SpeechSynthesisUtterance(champ + ' ' + timeName + ' timer initiated');
        $scope.timerWarning(msg);

        if ((timeName == 'flash' || timeName == 'teleport' || timeName == 'ghost') && $('.distortion-' + champId).data('distortion') === true) timeDur = timeDur * .85;
        if ($('.distortion-' + champId).data('insight')) timeDur = timeDur * .85;
        if ($('.lucidity-' + champId).data('lucidity')) timeDur = timeDur * .90;
        timeDur = timeDur.toFixed(0);
        $scope.$apply(function () {
            $scope.timerSurface.push({
                champion: champ,
                timeName: timeName,
                timeDur: timeDur - 5,
                timeDurMax: timeDurMax,
                champId: champId,
                timerId: timerId
            });
        });
    };
    $(document).ready(function () {
        window.speechSynthesis.onvoiceschanged = function (e) {
            try {
                speechSynthesis.loadVoices();
            } catch (e) {

            }
        };
        if ('speechSynthesis' in window) {
            $scope.timerWarning = function (msg) {
                msg.voice = speechSynthesis.getVoices().filter(function (voice) {
                    return voice.voiceURI == 'Google US English';
                })[0];
                msg.lang = 'en-US';
                msg.volume = $('.voice-assist-volume').val() / 100;
                speechSynthesis.speak(msg)
            }
        } else {
            //tell update browser
        }
    });
    //timer handler
    $(document).ready(function() {
        (function theLoop(n) {
            setTimeout(function () {
                var listItem = $('.tmr');
                var listItemSpan = $('.timer-instance-wrapper li span');
                for (var i = 0; i < $scope.timerSurface.length; i++) {
                    var timerWrap = listItem.eq(i).find('div').text();
                    if ($scope.timerSurface[i].timeDur > 0) {
                        var timerName = listItem.eq(i).find('div').text().split(' ').pop();
                        var champName = listItem.eq(i).find('div').text().split(' ').shift();
                        timerName = timerName.replace(/\s+/g, '');
                        champName = champName.replace(/\s+/g, '');
                        var reminderInit = $('.timer-reminder input').val();
                        var reminderSplit = reminderInit.split(':');
                        var reminderActual = 30;
                        if (reminderSplit.length == 1) reminderActual = reminderSplit[0];
                        else if (reminderSplit.length == 2 && reminderSplit[1] < 61) {
                            var reminderPreActual = (reminderSplit[0] * 1) * reminderSplit[1];
                            if (reminderPreActual > $scope.timerSurface[i].timeDurMax) {
                            } else {
                                reminderActual = reminderPreActual;
                            }
                        }
                        if ($scope.timerSurface[i].timeDur == reminderActual) {

                            var playBack = reminderActual + ' seconds until ' + timerWrap;
                            var msg = new SpeechSynthesisUtterance(playBack);
                            $scope.timerWarning(msg);
                        }
                        timerName = timerName.replace(/\s+/g, '');
                        var currentTimePerc = parseInt(listItemSpan.eq(i).text()) / $scope.timerSurface[i].timeDurMax;
                        listItemSpan.eq(i).css('background-color', getColorForPercentage(currentTimePerc));
                        $scope.$apply(function () {
                            $scope.timerSurface[i].timeDur--;
                        })
                    }
                    else {
                        var playBack = timerWrap + ' is now up';
                        var msg = new SpeechSynthesisUtterance(playBack);
                        $scope.timerWarning(msg);
                        $scope.$apply(function () {
                            $scope.timerSurface.splice(i, 1);
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

    $scope.timerStart = function (ssName, champName) {
        if (ssName != 11) { //check for smite
            $scope.ssConversion(ssName);
            $scope.champConversion(champName);
            if ($scope.timerAlreadyExists()) {
                $scope.initTimer();
            } else {
                var msg = new SpeechSynthesisUtterance($scope.askChamp + ' ' + $scope.askTimer + ' up in ' + $scope.askTimerDur + ' seconds');
                $scope.timerWarning(msg);
            }
        }
    };

    $scope.clearTimers = function(){
        for (var i = 0; i < $scope.timerSurface.length; i++) {
            var champId = $scope.timerSurface[i].champId;
            var spellId = $scope.timerSurface[i].timerId;
            $('.' + spellId + '-' + champId).trigger('clearAnimation');
        }
        $scope.timerSurface = [];
    };
    $scope.summonerSpells = [{
        id: 'flash',
        duration: 300,
        icon: 4,
        refr: ['/', 'clash', 'iflash', 'watch', 'brush', 'wash', 'flush', 'fish', 'plush', 'rush', 'trash', 'splash', 'lash', 'slash']
    }, {
        id: 'teleport', //iTeleport for Rek'Sai (add for all summoners)
        duration: 300,
        icon: 12,
        refr: ['iteleport', 'tp', 'heliport', 'telephone', 'teleforce', 'teleporter']
    }, {
        id: 'heal',
        duration: 240,
        icon: 7,
        refr: ['iheal', 'heel', 'he\'ll', 'eel', 'steel', 'hill', 'steele', 'eel']
    }, {
        id: 'exhaust',
        duration: 210,
        icon: 3,
        refr: ['iexhaust', 'accost', 'criss-crossed', 'crisscrossed', 'defrost', 'embossed']
    }, {
        id: 'ignite',
        duration: 210,
        icon: 14,
        refr: ['night', 'ignite', 'ignitor']
    }, {
        id: 'barrier',
        duration: 210,
        icon: 21,
        refr: ['ibarrier', 'farrier', 'barrel', 'berrier']
    }, {
        id: 'cleanse',
        duration: 210,
        icon: 1,
        refr: ['icleanse']
    }, {
        id: 'ghost',
        duration: 210,
        icon: 6,
        refr: ['ighost']
    }, {
        id: 'clarity',
        duration: 180,
        icon: 13,
        refr: ['charity', 'parity', 'rarity']
    }, {
        id: 'snowball',
        duration: 40,
        icon: 32,
        refr: ['mark', 'marc']
    }];


    $scope.objectives = [
        {
            id: 'Inhibitor',
            duration: 300,
            refr: ['inhibitor'],
            lane: ['Top', 'Mid', 'Bot'],
            relation: [{
                id: 'Ally',
                refr: ['ally', 'la', 'li', 'apply', 'ai', 'buy', 'ballet', 'alli', 'alloy', 'allied', 'a lie']
            },
                {
                    id: 'Enemy',
                    refr: ['enemy', 'anime', 'anomie', 'anna me', 'enemies']
                }],
            jungle: false,
            dynamic: true
    }, {
            id: 'Scuttle Crab',
            duration: 180,
            icon: '0scuttle',
            refr: ['scuttle', 'schedule', 'scheduled', 'cuddle', 'settle'],
            lane: ['Top', 'Bot'],
            jungle: false,
            dynamic: true
    }, {
            id: 'Dragon',
            duration: 360,
            icon: '0dragon',
            refr: ['dragon', 'drake'],
            jungle: false,
            dynamic: false
    }, {
            id: 'Baron',
            duration: 420,
            icon: '0baron',
            refr: ['baron'],
            jungle: false,
            dynamic: false
    }, {
            id: 'Rift Herald',
            duration: 300,
            icon: '0herald',
            refr: ['herald'],
            jungle: false,
            dynamic: false
    }, {
            id: 'Krugs',
            duration: 100,
            icon: '0krug',
            refr: ['krugs', 'rugs', 'drugs', 'crux', 'roads'],
            jungle: true,
            dynamic: false
    }, {
            id: 'Wolves',
            duration: 100,
            icon: '0wolf',
            refr: ['wolves', 'wolf'],
            jungle: true,
            dynamic: false
    }, {
            id: 'Gromp',
            duration: 100,
            icon: '0gromp',
            refr: ['rump', 'frog', 'gromp', 'prompt', 'bron', 'romp', 'from', 'grump', 'trump', 'drunk', 'ground', 'gram', 'rum', 'rom', 'grown'],
            jungle: true,
            dynamic: false
    }, {
            id: 'Raptors',
            duration: 100,
            icon: '0raptor',
            refr: ['raptors', 'chickens', 'race', 'rates', 'wastes'],
            jungle: true,
            dynamic: false
    }, {
            id: 'Red Buff',
            duration: 300,
            icon: '0red',
            refr: ['red', 'redbus', 'bus', 'read'],
            jungle: true,
            dynamic: false
    }, {
            id: 'Blue Buff',
            duration: 300,
            icon: '0blue',
            refr: ['blue'],
            jungle: true,
            dynamic: false
        }];

    //create valid language reference to
    $scope.champion =

        [{id: ['atrix', 'attracts', 'attract', ' 8 tracks'], name: 'Aatrox', icon: 266},
            {
                id: ['re',
                    'a',
                    'a.',
                    'ae',
                    'ay',
                    'b',
                    'b.',
                    'bay',
                    'baye',
                    'bayh',
                    'be',
                    'bea',
                    'bee',
                    'bey',
                    'blay',
                    'blea',
                    'bley',
                    'brae',
                    'bray',
                    'brea',
                    'bree',
                    'brey',
                    'brie',
                    'bui',
                    'buie',
                    'c',
                    'c\'est',
                    'c.',
                    'cay',
                    'che',
                    'chea',
                    'chee',
                    'chez',
                    'cie',
                    'clay',
                    'cray',
                    'crea',
                    'cree',
                    'd',
                    'd.',
                    'dae',
                    'day',
                    'daye',
                    'de',
                    'dea',
                    'dee',
                    'dey',
                    'di',
                    'dray',
                    'drey',
                    'e',
                    'e.',
                    'ee',
                    'fay',
                    'faye',
                    'fe',
                    'fee',
                    'fey',
                    'fi',
                    'flay',
                    'flea',
                    'flee',
                    'fray',
                    'free',
                    'freeh',
                    'frey',
                    'fsi',
                    'g',
                    'g.',
                    'gai',
                    'gay',
                    'gaye',
                    'gee',
                    'ghee',
                    'glee',
                    'gray',
                    'graye',
                    'grey',
                    'guay',
                    'gway',
                    'gyi',
                    'haigh',
                    'hay',
                    'haye',
                    'he',
                    'hee',
                    'hey',
                    'hwe',
                    'j',
                    'j.',
                    'jae',
                    'jay',
                    'jaye',
                    'je',
                    'jee',
                    'ji',
                    'jie',
                    'k',
                    'k.',
                    'kay',
                    'kaye',
                    'kea',
                    'kee',
                    'key',
                    'khe',
                    'ki',
                    'klay',
                    'klee',
                    'kley',
                    'knee',
                    'kray',
                    'krey',
                    'kyi',
                    'lait',
                    'lay',
                    'laye',
                    'lea',
                    'lee',
                    'lei',
                    'leigh',
                    'les',
                    'ley',
                    'leyh',
                    'li',
                    'lxi',
                    'mae',
                    'may',
                    'maye',
                    'me',
                    'mea',
                    'mee',
                    'mei',
                    'mey',
                    'mi',
                    'nay',
                    'ne',
                    'nee',
                    'nej',
                    'ney',
                    'nghi',
                    'ni',
                    'nie',
                    'oui',
                    'p',
                    'p.',
                    'pay',
                    'paye',
                    'pea',
                    'peay',
                    'pee',
                    'pei',
                    'play',
                    'plea',
                    'pray',
                    'pre',
                    'pree',
                    'prey',
                    'pri',
                    'prix',
                    'qi',
                    'quai',
                    'quay',
                    'quaye',
                    'qui',
                    'rae',
                    'ray',
                    'raye',
                    'rea',
                    'reay',
                    'ree',
                    'reeh',
                    'rey',
                    'rhee',
                    'say',
                    'saye',
                    'schey',
                    'schlee',
                    'schley',
                    'schlie',
                    'schnee',
                    'sci',
                    'se',
                    'sea',
                    'seay',
                    'see',
                    'shay',
                    'she',
                    'shea',
                    'shi',
                    'shieh',
                    'shih',
                    'shri',
                    'si',
                    'sie',
                    'sieh',
                    'ski',
                    'slay',
                    'slee',
                    'sleigh',
                    'smay',
                    'smee',
                    'snay',
                    'snee',
                    'spey',
                    'spie',
                    'spray',
                    'spree',
                    'sri',
                    'stay',
                    'stray',
                    'strey',
                    'sway',
                    'sze',
                    't',
                    't.',
                    'tae',
                    'tay',
                    'te',
                    'tea',
                    'tee',
                    'thee',
                    'they',
                    'thi',
                    'three',
                    'ti',
                    'tray',
                    'tre',
                    'tree',
                    'trey',
                    'tse',
                    'v',
                    'v.',
                    've',
                    'vee',
                    'vey',
                    'vi',
                    'way',
                    'waye',
                    'we',
                    'wee',
                    'wei',
                    'weigh',
                    'wey',
                    'whey',
                    'wiehe',
                    'wray',
                    'wy',
                    'xi',
                    'xie',
                    'yay',
                    'ye',
                    'yea',
                    'yee',
                    'yi',
                    'yie',
                    'z',
                    'z.',
                    'ze',
                    'zea',
                    'zee',
                    'zi'],
                name: 'Ahri',
                icon: 103
            },
            {id: ['akali', 'mccolley'], name: 'Akali', icon: 84},
            {id: ['allistar', 'all star'], name: 'Alistar', icon: 12},
            {id: ['a muumuu', 'amumu'], name: 'Amumu', icon: 32},
            {
                id: ['interview', 'nivea', 'in india'],
                name: 'Anivia',
                icon: 34
            },
            {
                id: ['any',
                    'manny',
                    'in a',
                    'anny',
                    'brani',
                    'canney',
                    'canny',
                    'cranney',
                    'cranny',
                    'dannie',
                    'danny',
                    'fannie',
                    'fanny',
                    'frannie',
                    'franny',
                    'granny',
                    'hani',
                    'hanney',
                    'hanni',
                    'hannie',
                    'hanny',
                    'janney',
                    'lanni',
                    'lanny',
                    'manney',
                    'manni',
                    'mannie',
                    'manny',
                    'nanney',
                    'nanni',
                    'nanny',
                    'panny',
                    'ranney',
                    'sani',
                    'stannie',
                    'tanney',
                    'vanni',
                    'vannie',
                    'vanny',
                    'yanni',
                    'zanni'],
                name: 'Annie',
                icon: 1
            },
            {
                id: ['-',
                    'pass',
                    'ash',
                    'as',
                    'cash',
                    'asch',
                    'asche',
                    'ash',
                    'basch',
                    'bash',
                    'brasch',
                    'brash',
                    'cache',
                    'cash',
                    'clash',
                    'crash',
                    'dasch',
                    'dash',
                    'flasch',
                    'flash',
                    'frasch',
                    'gash',
                    'gnash',
                    'guasch',
                    'hasch',
                    'hash',
                    'kasch',
                    'kash',
                    'lasch',
                    'lash',
                    'masch',
                    'mash',
                    'nash',
                    'pash',
                    'rasch',
                    'rasche',
                    'rash',
                    'sash',
                    'slash',
                    'smash',
                    'splash',
                    'stash',
                    'tasch',
                    'tash',
                    'thrash',
                    'trash'],
                name: 'Ashe',
                icon: 22
            },
            {
                id: ['aurelien ', 'aurelien scholl', 'aurelien soul', 'aurelien Seoul', 'aurelien Sol', 'aurelien sole'],
                name: 'Aurelion Sol',
                icon: 136
            },
            {
                id: ['easier', 'of the', 'as a', 'as you', 'cheesier'],
                name: 'Azir',
                icon: 268
            },
            {
                id: ['barred',
                    'card',
                    'ard',
                    'barred',
                    'byard',
                    'card',
                    'chard',
                    'charred',
                    'gard',
                    'garde',
                    'giard',
                    'guard',
                    'hard',
                    'huard',
                    'jarred',
                    'lard',
                    'marred',
                    'nard',
                    'parde',
                    'scarred',
                    'shard',
                    'sparred',
                    'starred',
                    'suard',
                    'tarred',
                    'yard',
                    'yarde'],
                name: 'Bard',
                icon: 432
            },
            {
                id: ['blitz',
                    'bits',
                    'bitz',
                    'brits',
                    'britts',
                    'britz',
                    'chits',
                    'critz',
                    'fits',
                    'fitts',
                    'fitz',
                    'frits',
                    'fritts',
                    'fritz',
                    'gets',
                    'glitz',
                    'grits',
                    'gritz',
                    'hits',
                    'hitz',
                    'hritz',
                    'it\'s',
                    'its',
                    'kits',
                    'kitts',
                    'kitz',
                    'klitz',
                    'knits',
                    'kritz',
                    'lits',
                    'litts',
                    'litz',
                    'mitts',
                    'nitz',
                    'pits',
                    'pitt\'s',
                    'pitts',
                    'pitz',
                    'pritts',
                    'pritz',
                    'quits',
                    'ritt\'s',
                    'ritts',
                    'ritz',
                    'schlitz',
                    'schmidt\'s',
                    'schmitz',
                    'schnitz',
                    'sits',
                    'sitts',
                    'sitz',
                    'skits',
                    'slits',
                    'smits',
                    'spits',
                    'spitz',
                    'splits',
                    'stitz',
                    'tritz',
                    'wit\'s',
                    'wits',
                    'witts',
                    'witz',
                    'writs'],
                name: 'Blitzcrank',
                icon: 53
            },
            {
                id: ['friend',
                    'and',
                    'band',
                    'banned',
                    'bland',
                    'brande',
                    'canned',
                    'chand',
                    'fanned',
                    'gland',
                    'grand',
                    'grande',
                    'hand',
                    'land',
                    'lande',
                    'manned',
                    'panned',
                    'planned',
                    'rand',
                    'sand',
                    'sande',
                    'scanned',
                    'shand',
                    'spanned',
                    'stand',
                    'strand',
                    'strande',
                    'tanned',
                    'vande',
                    'zand'],
                name: 'Brand',
                icon: 63
            },
            {
                id: ['from',
                    'bomb',
                    'prom',
                    'bluhm',
                    'brum',
                    'brumm',
                    'bum',
                    'chum',
                    'clum',
                    'come',
                    'crum',
                    'crumb',
                    'crumm',
                    'cum',
                    'drum',
                    'drumm',
                    'dum',
                    'dumb',
                    'dumm',
                    'frum',
                    'glum',
                    'grum',
                    'gum',
                    'gumm',
                    'hum',
                    'humm',
                    'klumb',
                    'krum',
                    'krumm',
                    'krumme',
                    'kumm',
                    'lum',
                    'lumb',
                    'lumm',
                    'maam',
                    'mum',
                    'mumm',
                    'mumme',
                    'numb',
                    'pflum',
                    'plum',
                    'plumb',
                    'rum',
                    'schrum',
                    'schum',
                    'schumm',
                    'scum',
                    'shrum',
                    'shum',
                    'slum',
                    'some',
                    'strum',
                    'stum',
                    'stumm',
                    'sum',
                    'swum',
                    'thum',
                    'thumb',
                    'thumm',
                    'um',
                    'umm',
                    'yum'],
                name: 'Braum',
                icon: 201
            },
            {id: ['caitlin'], name: 'Caitlyn', icon: 51},
            {
                id: ['pass',
                    'ass',
                    'bass',
                    'basse',
                    'blass',
                    'bras',
                    'brass',
                    'cas',
                    'cass',
                    'chasse',
                    'class',
                    'crass',
                    'das',
                    'dass',
                    'fahs',
                    'fass',
                    'gas',
                    'gass',
                    'glas',
                    'glass',
                    'gras',
                    'grass',
                    'grasse',
                    'hass',
                    'jass',
                    'kass',
                    'klas',
                    'klass',
                    'kras',
                    'krass',
                    'lass',
                    'last',
                    'mass',
                    'mass.',
                    'masse',
                    'nass',
                    'plas',
                    'plass',
                    'plasse',
                    'ras',
                    'sas',
                    'sass',
                    'sasse',
                    'tass',
                    'vass',
                    'yass'],
                name: 'Cassiopeia',
                icon: 69
            },
            {
                id: ['toget',
                    'show gas',
                    'shell gas',
                    'shogun',
                    'to gas',
                    'focus',
                    'show gas',
                    'show',
                    'crocus',
                    'hocus',
                    'locus',
                    'pocus'],
                name: 'Cho\'Gath',
                icon: 31
            },
            {
                id: ['corky',
                    'porky',
                    'gorki',
                    'gorky',
                    'horkey',
                    'horky',
                    'orky',
                    'porky',
                    'shorkey'],
                name: 'Corki',
                icon: 42
            },
            {
                id: ['areas',
                    'dharius',
                    'sirius',
                    'period',
                    'area\'s',
                    'farias',
                    'peria\'s'],
                name: 'Darius',
                icon: 122
            },
            {id: ['vienna', 'dyana'], name: 'Diana', icon: 131},
            {id: ['mundo', 'dr mundo'], name: 'Dr. Mundo', icon: 36},
            {id: [''], name: 'Draven', icon: 119},
            {
                id: ['echo',
                    'ago',
                    'breco',
                    'creko',
                    'deco',
                    'eco',
                    'ekco',
                    'eko',
                    'gecko',
                    'gekko',
                    'grecco',
                    'grecko',
                    'greco',
                    'hecco',
                    'krecko',
                    'mlecko',
                    'reco',
                    'seco',
                    'seko'],
                name: 'Ekko',
                icon: 245
            },
            {
                id: ['at least',
                    'police',
                    'release',
                    'falise',
                    'felice',
                    'lollis',
                    'police'],
                name: 'Elise',
                icon: 60
            },
            {id: ['evelyn', 'eve', 'eveline'], name: 'Evelynn', icon: 28},
            {
                id: ['azrael',
                    'israel',
                    'as',
                    'as real',
                    'is real',
                    'baz',
                    'blais',
                    'braz',
                    'chaz',
                    'chazz',
                    'chez',
                    'faz',
                    'fez',
                    'gaz',
                    'ghez',
                    'guez',
                    'has',
                    'jazz',
                    'mez',
                    'mraz',
                    'nez',
                    'pez',
                    'pres',
                    'raz',
                    'says',
                    'vaz'],
                name: 'Ezreal',
                icon: 81
            },
            {
                id: ['fiddle',
                    'biddle',
                    'criddle',
                    'friddle',
                    'kiddle',
                    'liddell',
                    'liddle',
                    'middle',
                    'piddle',
                    'riddell',
                    'riddle',
                    'rydell',
                    'schmidl',
                    'siddall',
                    'siddell',
                    'siddle',
                    'spidel',
                    'spidell',
                    'twiddle',
                    'widdle',
                    'widell'],
                name: 'Fiddlesticks',
                icon: 9
            },
            {
                id: ['ciara',
                    'viewer',
                    't ara',
                    'for a',
                    'for',
                    'you are',
                    'feur',
                    'fewr',
                    'few are',
                    'bluer',
                    'booher',
                    'breuer',
                    'brewer',
                    'bruer',
                    'buehrer',
                    'buer',
                    'chewer',
                    'couper',
                    'dewar',
                    'dewarr',
                    'duer',
                    'ewer',
                    'feuer',
                    'fewer',
                    'fluor',
                    'grauer',
                    'heuer',
                    'hewer',
                    'kruer',
                    'kuhar',
                    'newer',
                    'pruer',
                    'sewer',
                    'skewer',
                    'truer',
                    'uher',
                    'who\'re'],
                name: 'Fiora',
                icon: 114
            },
            {
                id: ['sis',
                    'is',
                    'foods',
                    'physica',
                    'face',
                    'biz',
                    'buis',
                    'czyz',
                    'griz',
                    'his',
                    'is',
                    'kriz',
                    'liz',
                    'ms',
                    'ms.',
                    'quiz',
                    'riz',
                    'says',
                    'tis',
                    'whiz',
                    'wiz'],
                name: 'Fizz',
                icon: 105
            },
            {id: [''], name: 'Galio', icon: 3},
            {id: ['gp'], name: 'Gangplank', icon: 41},
            {
                id: ['erin',
                    'ferrin',
                    'garin',
                    'guerin',
                    'herin',
                    'herrin',
                    'karin',
                    'kerin',
                    'marin',
                    'merrin',
                    'perrin',
                    'schwerin',
                    'sherin',
                    'sherrin'],
                name: 'Garen',
                icon: 86
            },
            {
                id: ['no',
                    'not',
                    'nor',
                    'are',
                    'in our',
                    'our',
                    'au',
                    'aux',
                    'beau',
                    'beaux',
                    'bleau',
                    'blow',
                    'blowe',
                    'bo',
                    'boe',
                    'boeh',
                    'bow',
                    'bowe',
                    'breau',
                    'breault',
                    'breaux',
                    'bro',
                    'broe',
                    'browe',
                    'cau',
                    'chau',
                    'cho',
                    'choe',
                    'cloe',
                    'clow',
                    'co',
                    'co.',
                    'coe',
                    'cro',
                    'crow',
                    'crowe',
                    'dau',
                    'doe',
                    'doh',
                    'dough',
                    'eau',
                    'eaux',
                    'flo',
                    'floe',
                    'flow',
                    'flowe',
                    'foe',
                    'fro',
                    'froh',
                    'gau',
                    'glo',
                    'gloe',
                    'glow',
                    'go',
                    'goe',
                    'gogh',
                    'goh',
                    'gro',
                    'groh',
                    'grow',
                    'growe',
                    'ho',
                    'hoe',
                    'hoh',
                    'jo',
                    'joe',
                    'joh',
                    'know',
                    'ko',
                    'koh',
                    'krogh',
                    'kroh',
                    'krowe',
                    'kyo',
                    'lo',
                    'loe',
                    'loew',
                    'loewe',
                    'loh',
                    'low',
                    'lowe',
                    'luo',
                    'm\'bow',
                    'mau',
                    'meaux',
                    'mo',
                    'moe',
                    'mow',
                    'nau',
                    'neault',
                    'noe',
                    'noh',
                    'o',
                    'o\'',
                    'o.',
                    'oh',
                    'ow',
                    'owe',
                    'plough',
                    'po',
                    'poe',
                    'poh',
                    'pro',
                    'queau',
                    'quo',
                    'reaux',
                    'rheault',
                    'rho',
                    'ro',
                    'roe',
                    'roh',
                    'rohe',
                    'row',
                    'rowe',
                    'schau',
                    'sew',
                    'sgro',
                    'show',
                    'sloe',
                    'slow',
                    'snow',
                    'snowe',
                    'so',
                    'sow',
                    'stow',
                    'stowe',
                    'stroh',
                    'strow',
                    'tho',
                    'though',
                    'throw',
                    'toe',
                    'tow',
                    'towe',
                    'trow',
                    'tso',
                    'vo',
                    'whoa',
                    'wo',
                    'woe',
                    'wroe',
                    'yau',
                    'yo',
                    'yoe',
                    'yoh',
                    'zoh'],
                name: 'Gnar',
                icon: 150
            },
            {
                id: ['ragus', 'caracas', 'vegas', 'ragga', 'degas'],
                name: 'Gragas',
                icon: 79
            },
            {
                id: ['grey\'s',
                    'braves',
                    'braves\'',
                    'cave\'s',
                    'caves',
                    'chaves',
                    'craves',
                    'dave\'s',
                    'daves',
                    'draves',
                    'knaves',
                    'maves',
                    'paves',
                    'raves',
                    'save\'s',
                    'saves',
                    'shaves',
                    'slaves',
                    'staves',
                    'taves',
                    'waives',
                    'waves'],
                name: 'Graves',
                icon: 104
            },
            {id: [''], name: 'Hecarim', icon: 120},
            {
                id: ['donner',
                    'longer',
                    'donger',
                    'ahner',
                    'bahner',
                    'bonnor',
                    'bronner',
                    'chronar',
                    'conner',
                    'connor',
                    'donar',
                    'fonar',
                    'fonner',
                    'goner',
                    'hahner',
                    'honor',
                    'honore',
                    'jahner',
                    'konner',
                    'sonner',
                    'swanner',
                    'wanner',
                    'zahner'],
                name: 'Heimerdinger',
                icon: 74
            },
            {
                id: ['allow a',
                    'allow we',
                    'allowe me',
                    'allowed',
                    'allowing',
                    'aloud'],
                name: 'Illaoi',
                icon: 420
            },
            {id: [''], name: 'Irelia', icon: 39},
            {
                id: ['johnny',
                    'jana',
                    'camera',
                    'jonna',
                    'johnna',
                    'donna',
                    'ana',
                    'anna',
                    'branna',
                    'cana',
                    'chana',
                    'danna',
                    'flanna',
                    'frana',
                    'ghana',
                    'grana',
                    'hana',
                    'hanna',
                    'hannah',
                    'jana',
                    'kana',
                    'khanna',
                    'lana',
                    'lanna',
                    'llana',
                    'manna',
                    'nana',
                    'nanna',
                    'rana',
                    'sanna',
                    'santa',
                    'santa\'s',
                    'shana',
                    'vana',
                    'vanna',
                    'vrana'],
                name: 'Janna',
                icon: 40
            },
            {
                id: ['garden',
                    'jarvan',
                    'jarvan the fourth',
                    'j 4',
                    'g 4',
                    'german',
                    'arden',
                    'barden',
                    'carden',
                    'darden',
                    'harden',
                    'marden',
                    'mardon',
                    'parden',
                    'pardon',
                    'rardon',
                    'varden'],
                name: 'Jarvan IV',
                icon: 59
            },
            {
                id: ['jack',
                    'jack\'s',
                    'jacks',
                    'ack',
                    'akc',
                    'backe',
                    'bak',
                    'bakke',
                    'black',
                    'brac',
                    'brack',
                    'brakke',
                    'braque',
                    'cac',
                    'caq',
                    'clack',
                    'crack',
                    'dac',
                    'dack',
                    'dak',
                    'fac',
                    'flack',
                    'flak',
                    'hack',
                    'hacke',
                    'haq',
                    'haque',
                    'jac',
                    'jacques',
                    'knack',
                    'krack',
                    'kracke',
                    'kwak',
                    'lac',
                    'lack',
                    'lak',
                    'mac',
                    'mack',
                    'macke',
                    'mak',
                    'nack',
                    'nacke',
                    'pac',
                    'pack',
                    'pak',
                    'paque',
                    'plack',
                    'placke',
                    'plaque',
                    'ptak',
                    'quack',
                    'rack',
                    'rak',
                    'sak',
                    'schack',
                    'schlack',
                    'schnack',
                    'schrack',
                    'shack',
                    'shaq',
                    'slack',
                    'smack',
                    'snack',
                    'spack',
                    'spak',
                    'stac',
                    'stack',
                    'strack',
                    'stracke',
                    'tac',
                    'tack',
                    'tacke',
                    'tak',
                    'trac',
                    'track',
                    'trak',
                    'wack',
                    'whack',
                    'wrack'],
                name: 'Jax',
                icon: 24
            },
            {
                id: ['chase',
                    'js',
                    'rays',
                    'james',
                    'games',
                    'jace',
                    'juice',
                    'juice',
                    'ace',
                    'base',
                    'bass',
                    'brace',
                    'caisse',
                    'case',
                    'cayce',
                    'chace',
                    'crace',
                    'dace',
                    'drace',
                    'face',
                    'frace',
                    'glace',
                    'grace',
                    'heyse',
                    'lace',
                    'mace',
                    'mais',
                    'nace',
                    'pace',
                    'place',
                    'race',
                    'rais',
                    'space',
                    'trace',
                    'vase',
                    'wace'],
                name: 'Jayce',
                icon: 126
            },
            {
                id: ['gym',
                    'in',
                    'gin',
                    'bihm',
                    'brim',
                    'brimm',
                    'clim',
                    'crim',
                    'crimm',
                    'dim',
                    'flim',
                    'grim',
                    'grimm',
                    'grimme',
                    'him',
                    'hymn',
                    'im',
                    'imm',
                    'jim',
                    'kim',
                    'kimm',
                    'klim',
                    'klym',
                    'krim',
                    'kym',
                    'lim',
                    'limb',
                    'mihm',
                    'mim',
                    'pimm',
                    'prim',
                    'primm',
                    'pymm',
                    'rim',
                    'shim',
                    'sim',
                    'simm',
                    'skim',
                    'slim',
                    'swim',
                    'sym',
                    'tim',
                    'timm',
                    'timme',
                    'trim',
                    'trimm',
                    'vim',
                    'whim',
                    'yim',
                    'zim'],
                name: 'Jhin',
                icon: 202
            },
            {
                id: ['blinks',
                    'brinks',
                    'chinks',
                    'drinks',
                    'finks',
                    'inc.\'s',
                    'inks',
                    'jinks',
                    'jynx',
                    'kinks',
                    'links',
                    'lynx',
                    'mincks',
                    'minks',
                    'pinks',
                    'rinks',
                    'shrinks',
                    'sinks',
                    'skinks',
                    'sphinx',
                    'spinks',
                    'stinks',
                    'think\'s',
                    'thinks',
                    'winks',
                    'blinks',
                    'brink\'s',
                    'brinks',
                    'chinks',
                    'drinks',
                    'fink\'s',
                    'finks',
                    'inc.\'s',
                    'inks',
                    'jinks',
                    'jynx',
                    'kinks',
                    'lincks',
                    'link\'s',
                    'links',
                    'lynx',
                    'mincks',
                    'minks',
                    'pinks',
                    'rinks',
                    'shrinks',
                    'sinks',
                    'skinks',
                    'sphinx',
                    'spinks',
                    'stinks',
                    'think\'s',
                    'thinks',
                    'winks'],
                name: 'Jinx',
                icon: 222
            },
            {id: ['calista', 'callista'], name: 'Kalista', icon: 429},
            {
                id: [',',
                    'CARMA',
                    'carma',
                    'dharma',
                    'parma',
                    'pharma',
                    'sharma',
                    'varma'],
                name: 'Karma',
                icon: 43
            },
            {id: ['curtis', 'carthage', 'carson', 'kurtis'], name: 'Karthus', icon: 30},
            {id: ['castleton', 'castle in', 'kasidon', 'catherine', 'cassidon'], name: 'Kassadin', icon: 38},
            {id: ['catarina', 'katharina'], name: 'Katarina', icon: 55},
            {
                id: ['kill',
                    'will',
                    'sale',
                    'scale',
                    'till',
                    'bihl',
                    'bil',
                    'bill',
                    'brill',
                    'chill',
                    'crill',
                    'dill',
                    'dille',
                    'drill',
                    'fil',
                    'fill',
                    'fril',
                    'frill',
                    'gil',
                    'gill',
                    'grill',
                    'grille',
                    'guill',
                    'hill',
                    'hille',
                    'il',
                    'ill',
                    'jil',
                    'jill',
                    'kille',
                    'knill',
                    'krill',
                    'lil',
                    'lill',
                    'lille',
                    'mil',
                    'mill',
                    'mille',
                    'nil',
                    'nill',
                    'phil',
                    'pihl',
                    'pil',
                    'pill',
                    'pille',
                    'prill',
                    'quill',
                    'rill',
                    'schill',
                    'shill',
                    'shrill',
                    'sil',
                    'sill',
                    'skill',
                    'spill',
                    'stihl',
                    'stil',
                    'still',
                    'stille',
                    'swill',
                    'thill',
                    'thrill',
                    'til',
                    'till',
                    'trill',
                    'twill',
                    'ville',
                    'we\'ll',
                    'wil',
                    'will',
                    'wille',
                    'zil',
                    'zill'],
                name: 'Kayle',
                icon: 10
            },
            {
                id: ['tenon',
                    'cannon',
                    'canon',
                    'annan',
                    'annen',
                    'bannan',
                    'bannon',
                    'brannan',
                    'brannen',
                    'brannon',
                    'branon',
                    'cannan',
                    'canon',
                    'channon',
                    'dannen',
                    'fannon',
                    'gannon',
                    'grannan',
                    'hannan',
                    'hannen',
                    'hannon',
                    'lannan',
                    'lannen',
                    'lannon',
                    'mannen',
                    'mannon',
                    'shannon',
                    'tanen',
                    'tannen',
                    'yannone'],
                name: 'Kennen',
                icon: 85
            },
            {
                id: ['bug',
                    'bugg',
                    'bugge',
                    'chug',
                    'doug',
                    'drug',
                    'dug',
                    'hug',
                    'hugg',
                    'jug',
                    'klug',
                    'krug',
                    'lug',
                    'mug',
                    'plug',
                    'pug',
                    'rug',
                    'rugg',
                    'schug',
                    'shrug',
                    'slug',
                    'smug',
                    'snug',
                    'sugg',
                    'thug',
                    'tug',
                    'ugh',
                    'zug'],
                name: 'Kha\'Zix',
                icon: 121
            },
            {id: [''], name: 'Kindred', icon: 203},
            {
                id: ['card',
                    'cog',
                    'dog',
                    'ard',
                    'bard',
                    'barred',
                    'byard',
                    'chard',
                    'charred',
                    'gard',
                    'garde',
                    'giard',
                    'guard',
                    'hard',
                    'huard',
                    'jarred',
                    'lard',
                    'marred',
                    'nard',
                    'parde',
                    'scarred',
                    'shard',
                    'sparred',
                    'starred',
                    'suard',
                    'tarred',
                    'yard',
                    'yarde'],
                name: 'Kog\'Maw',
                icon: 96
            },
            {id: ['', 'lablanc'], name: 'LeBlanc', icon: 7},
            {
                id: ['leasing',
                    'leeson',
                    'listen',
                    'lease in',
                    'ceasing',
                    'diesing',
                    'fleecing',
                    'greasing',
                    'piecing',
                    'schmiesing',
                    'thesing'],
                name: 'Lee Sin',
                icon: 64
            },
            {id: [''], name: 'Leona', icon: 89},
            {id: ['andhra', 'andra'], name: 'Lissandra', icon: 127},
            {
                id: ['lucien', 'machine', 'illusion', 'motion', 'shooshan'],
                name: 'Lucian',
                icon: 236
            },
            {id: ['', 'lulue', 'zulu'], name: 'Lulu', icon: 117},
            {
                id: ['',
                    'bruck\'s',
                    'brucks',
                    'buchs',
                    'buck\'s',
                    'bucks',
                    'bucs',
                    'bucs\'',
                    'chuck\'s',
                    'clucks',
                    'crux',
                    'duck\'s',
                    'ducks',
                    'ducks\'',
                    'dux',
                    'flux',
                    'fucks',
                    'gluck\'s',
                    'hucks',
                    'hux',
                    'klux',
                    'lox',
                    'lucks',
                    'luks',
                    'pluck\'s',
                    'plucks',
                    'rucks',
                    'rux',
                    'shucks',
                    'sucks',
                    'szucs',
                    'truck\'s',
                    'trucks',
                    'trucks\'',
                    'tucks',
                    'tuks',
                    'tux',
                    'yuks'],
                name: 'Lux',
                icon: 99
            },
            {id: [''], name: 'Malphite', icon: 54},
            {id: [''], name: 'Malzahar', icon: 90},
            {
                id: ['alki',
                    'tree',
                    'malka',
                    '3',
                    'malachi',
                    'malakai',
                    'b',
                    'b.',
                    'be',
                    'bea',
                    'bee',
                    'blea',
                    'brea',
                    'bree',
                    'brie',
                    'bui',
                    'buie',
                    'c',
                    'c.',
                    'chea',
                    'chee',
                    'cie',
                    'crea',
                    'cree',
                    'd',
                    'd.',
                    'de',
                    'dea',
                    'dee',
                    'di',
                    'e',
                    'e.',
                    'ee',
                    'fee',
                    'fi',
                    'flea',
                    'flee',
                    'free',
                    'freeh',
                    'fsi',
                    'g',
                    'g.',
                    'gee',
                    'ghee',
                    'glee',
                    'gyi',
                    'he',
                    'hee',
                    'je',
                    'jee',
                    'ji',
                    'jie',
                    'kea',
                    'kee',
                    'key',
                    'khe',
                    'ki',
                    'klee',
                    'knee',
                    'kyi',
                    'lea',
                    'lee',
                    'leigh',
                    'li',
                    'lxi',
                    'me',
                    'mea',
                    'mee',
                    'mi',
                    'ne',
                    'nee',
                    'nghi',
                    'ni',
                    'nie',
                    'oui',
                    'p',
                    'p.',
                    'pea',
                    'peay',
                    'pee',
                    'plea',
                    'pre',
                    'pree',
                    'pri',
                    'prix',
                    'qi',
                    'quai',
                    'quay',
                    'qui',
                    're',
                    'ree',
                    'reeh',
                    'rhee',
                    'schlee',
                    'schlie',
                    'schnee',
                    'sci',
                    'sea',
                    'see',
                    'she',
                    'shi',
                    'shieh',
                    'shih',
                    'shri',
                    'si',
                    'sie',
                    'sieh',
                    'ski',
                    'slee',
                    'smee',
                    'snee',
                    'spie',
                    'spree',
                    'sri',
                    'sze',
                    't',
                    't.',
                    'te',
                    'tea',
                    'tee',
                    'thee',
                    'thi',
                    'three',
                    'ti',
                    'tse',
                    'v',
                    'v.',
                    've',
                    'vee',
                    'vi',
                    'we',
                    'wee',
                    'wiehe',
                    'xi',
                    'xie',
                    'ye',
                    'yee',
                    'yi',
                    'yie',
                    'z',
                    'z.',
                    'ze',
                    'zea',
                    'zee',
                    'zi'],
                name: 'Maoki',
                icon: 57
            },
            {
                id: ['master',
                    'masters',
                    'aster',
                    'astor',
                    'blaster',
                    'caster',
                    'castor',
                    'faster',
                    'gaster',
                    'jaster',
                    'kaster',
                    'laster',
                    'paster',
                    'pastor',
                    'pasztor',
                    'plaster',
                    'raster'],
                name: 'Master Yi',
                icon: 11
            },
            {id: ['misfortune', 'MF'], name: 'Miss Fortune', icon: 21},
            {id: [''], name: 'Mordekaiser', icon: 82},
            {id: [''], name: 'Morgana', icon: 25},
            {
                id: ['na me',
                    'mommy',
                    'mami',
                    'ami',
                    'balmy',
                    'commie',
                    'cromie',
                    'dommie',
                    'dromi',
                    'fahmy',
                    'rami',
                    'swami',
                    'tommie',
                    'tommy',
                    'twomey'],
                name: 'Nami',
                icon: 267
            },
            {
                id: ['asus', 'basis', 'nieces', 'nasa', 'susan', 'glacis'],
                name: 'Nasus',
                icon: 75
            },
            {id: [''], name: 'Nautilus', icon: 111},
            {
                id: ['in italy',
                    'need',
                    'did',
                    'bead',
                    'bede',
                    'beede',
                    'bleed',
                    'brede',
                    'breed',
                    'cede',
                    'creed',
                    'dede',
                    'deed',
                    'diede',
                    'eade',
                    'ede',
                    'fede',
                    'feed',
                    'frede',
                    'freed',
                    'freid',
                    'fried',
                    'friede',
                    'gaede',
                    'grede',
                    'greed',
                    'he\'d',
                    'heed',
                    'keyed',
                    'knead',
                    'kneed',
                    'lead',
                    'leed',
                    'mead',
                    'meade',
                    'nead',
                    'nied',
                    'peed',
                    'plead',
                    'read',
                    'reed',
                    'reid',
                    'ried',
                    'riede',
                    'schmead',
                    'schwede',
                    'screed',
                    'seed',
                    'she\'d',
                    'skied',
                    'smead',
                    'snead',
                    'sneed',
                    'speed',
                    'steed',
                    'streed',
                    'swede',
                    'teed',
                    'thede',
                    'thiede',
                    'tiede',
                    'tweed',
                    'we\'d',
                    'weed',
                    'wied',
                    'wrede'],
                name: 'Nidalee',
                icon: 76
            },
            {id: [''], name: 'Nocturne', icon: 56},
            {id: [''], name: 'Nunu', icon: 20},
            {id: [''], name: 'Olaf', icon: 2},
            {id: ['oriana'], name: 'Orianna', icon: 61},
            {id: [''], name: 'Pantheon', icon: 80},
            {
                id: ['papi',
                    'poppy',
                    'choppy',
                    'copy',
                    'floppy',
                    'gloppy',
                    'groppy',
                    'kopy',
                    'sloppy'],
                name: 'Poppy',
                icon: 78
            },
            {
                id: ['twin',
                    'win',
                    'queen',
                    'been',
                    'bihn',
                    'bin',
                    'binn',
                    'blinn',
                    'brin',
                    'brinn',
                    'bryn',
                    'chin',
                    'chinh',
                    'chinn',
                    'din',
                    'dinh',
                    'fin',
                    'finn',
                    'finne',
                    'flinn',
                    'flynn',
                    'gin',
                    'ginn',
                    'glyn',
                    'glynn',
                    'grin',
                    'guin',
                    'guinn',
                    'gwin',
                    'gwinn',
                    'gwyn',
                    'gwynn',
                    'gwynne',
                    'gyn',
                    'hinn',
                    'in',
                    'in.',
                    'inn',
                    'jin',
                    'kihn',
                    'kin',
                    'kinn',
                    'kinne',
                    'knin',
                    'lin',
                    'linh',
                    'linn',
                    'linne',
                    'lwin',
                    'lyn',
                    'lynn',
                    'lynne',
                    'mihn',
                    'min',
                    'minh',
                    'pin',
                    'pinn',
                    'prynne',
                    'qian',
                    'qin',
                    'quin',
                    'rhin',
                    'rihn',
                    'rinn',
                    'rinne',
                    'schwinn',
                    'shin',
                    'shinn',
                    'sin',
                    'sinn',
                    'skin',
                    'spin',
                    'syn',
                    'thin',
                    'tin',
                    'trinh',
                    'twin',
                    'vin',
                    'when',
                    'win',
                    'winn',
                    'winne',
                    'wynn',
                    'wynne',
                    'yin',
                    'zinn',
                    'zlin'],
                name: 'Quinn',
                icon: 133
            },
            {
                id: ['ramus', 'ramis', 'remus', 'amos', 'famous', 'seamus', 'shamus'],
                name: 'Rammus',
                icon: 33
            },
            {
                id: ['rec side',
                    'wreck site',
                    'rex i',
                    'rex',
                    'aix',
                    'beck\'s',
                    'becks',
                    'blech\'s',
                    'checks',
                    'czechs',
                    'dec\'s',
                    'decks',
                    'dex',
                    'eckes',
                    'ex',
                    'flecks',
                    'flex',
                    'heck\'s',
                    'hex',
                    'jex',
                    'lex',
                    'meckes',
                    'mex',
                    'necks',
                    'nex',
                    'next',
                    'peck\'s',
                    'plex',
                    'sex',
                    'sheck\'s',
                    'shek\'s',
                    'specks',
                    'specs',
                    'tech\'s',
                    'techs',
                    'teck\'s',
                    'tex',
                    'treks',
                    'vex',
                    'wrecks',
                    'x',
                    'x.'],
                name: 'Rek\'Sai',
                icon: 421
            },
            {id: [''], name: 'Renekton', icon: 58},
            {
                id: ['wrangler',
                    'angler',
                    'dangler',
                    'spangler',
                    'stangler',
                    'strangler',
                    'wangler'],
                name: 'Rengar',
                icon: 107
            },
            {
                id: ['ribbon',
                    'criven',
                    'driven',
                    'givan',
                    'given',
                    'ivane',
                    'striven'],
                name: 'Riven',
                icon: 92
            },
            {
                id: ['',
                    'bumble',
                    'crumble',
                    'fumble',
                    'grumble',
                    'gumbel',
                    'humble',
                    'jumble',
                    'kumble',
                    'mumble',
                    'stumble',
                    'trumble',
                    'trumbull',
                    'tumble',
                    'umbel',
                    'umble'],
                name: 'Rumble',
                icon: 68
            },
            {
                id: ['wise',
                    'ais',
                    'ayes',
                    'bies',
                    'bise',
                    'buy\'s',
                    'buys',
                    'chi\'s',
                    'cries',
                    'crise',
                    'di\'s',
                    'dies',
                    'dise',
                    'dries',
                    'dyes',
                    'eis',
                    'eye\'s',
                    'eyes',
                    'eyes\'',
                    'flies',
                    'fries',
                    'fry\'s',
                    'geis',
                    'gries',
                    'grise',
                    'guise',
                    'guy\'s',
                    'guys',
                    'guys\'',
                    'highs',
                    'hise',
                    'i\'s',
                    'i.\'s',
                    'i.s',
                    'ise',
                    'kise',
                    'kleis',
                    'knies',
                    'krise',
                    'kyes',
                    'lies',
                    'lise',
                    'mies',
                    'mize',
                    'nies',
                    'nuys',
                    'pies',
                    'plies',
                    'pries',
                    'prize',
                    'ries',
                    'rise',
                    'schleis',
                    'shies',
                    'sighs',
                    'size',
                    'skies',
                    'sky\'s',
                    'spies',
                    'spy\'s',
                    'thai\'s',
                    'thais',
                    'theis',
                    'thighs',
                    'ties',
                    'tries',
                    'tsai\'s',
                    'vies',
                    'why\'s',
                    'whys',
                    'wies',
                    'wyse',
                    'y\'s',
                    'y.\'s'],
                name: 'Ryze',
                icon: 13
            },
            {
                id: ['to johhny',
                    'said ronnie',
                    'did ronnie',
                    'to do any',
                    'to gianni',
                    'set',
                    'said',
                    'bet',
                    'bett',
                    'bret',
                    'brett',
                    'chet',
                    'debt',
                    'et',
                    'fett',
                    'fette',
                    'flett',
                    'fret',
                    'frett',
                    'get',
                    'goette',
                    'hett',
                    'jet',
                    'jett',
                    'jette',
                    'jfet',
                    'kett',
                    'klett',
                    'let',
                    'lett',
                    'met',
                    'mette',
                    'net',
                    'nett',
                    'nyet',
                    'pet',
                    'pett',
                    'piet',
                    'plett',
                    'pret',
                    'ret',
                    'rhett',
                    'sette',
                    'smet',
                    'stet',
                    'sweat',
                    'swett',
                    'tet',
                    'tete',
                    'threat',
                    'vet',
                    'vette',
                    'wet',
                    'whet',
                    'yet',
                    'yett'],
                name: 'Sejuani',
                icon: 113
            },
            {
                id: ['shako',
                    'chicago',
                    'shake',
                    'shaking',
                    'check',
                    'ache',
                    'ake',
                    'bake',
                    'blake',
                    'brake',
                    'break',
                    'cake',
                    'dake',
                    'drake',
                    'fake',
                    'flake',
                    'haik',
                    'hake',
                    'jacque',
                    'jake',
                    'lake',
                    'make',
                    'naik',
                    'paik',
                    'pake',
                    'plake',
                    'quake',
                    'rake',
                    'sake',
                    'schake',
                    'schlake',
                    'schnake',
                    'schwake',
                    'shaik',
                    'shaikh',
                    'shrake',
                    'snake',
                    'spake',
                    'stake',
                    'steak',
                    'take',
                    'wake',
                    'yake'],
                name: 'Shaco',
                icon: 35
            },
            {
                id: ['',
                    'behn',
                    'behne',
                    'ben',
                    'benn',
                    'benne',
                    'bren',
                    'brenn',
                    'chen',
                    'chien',
                    'dehn',
                    'dehne',
                    'den',
                    'denn',
                    'denne',
                    'en',
                    'fehn',
                    'fen',
                    'fenn',
                    'gen',
                    'glen',
                    'glenn',
                    'gren',
                    'gwen',
                    'hehn',
                    'hen',
                    'henn',
                    'henne',
                    'hren',
                    'jen',
                    'jenn',
                    'jenne',
                    'kehn',
                    'kehne',
                    'ken',
                    'kenn',
                    'kren',
                    'krenn',
                    'lehn',
                    'lehne',
                    'len',
                    'men',
                    'menn',
                    'menne',
                    'n',
                    'n.',
                    'pen',
                    'penh',
                    'penn',
                    'phen',
                    'prehn',
                    'prenn',
                    'rehn',
                    'ren',
                    'renn',
                    'renne',
                    'schwenn',
                    'sen',
                    'senn',
                    'senne',
                    'sten',
                    'sven',
                    'ten',
                    'tenn',
                    'then',
                    'tien',
                    'venn',
                    'venne',
                    'wen',
                    'when',
                    'wren',
                    'wrenn',
                    'yen',
                    'yene',
                    'yuen',
                    'zen'],
                name: 'Shen',
                icon: 98
            },
            {id: ['shyvana', 'she wanna'], name: 'Shyvanna', icon: 102},
            {
                id: ['since', 'send', 'sync', 'binged', 'cringed', 'hinged'],
                name: 'Singed',
                icon: 27
            },
            {id: [''], name: 'Sion', icon: 14},
            {
                id: ['silver', 'server', 'severe', 'fervor'],
                name: 'Sivir',
                icon: 15
            },
            {id: [''], name: 'Skarner', icon: 72},
            {id: ['so no'], name: 'Sona', icon: 37},
            {
                id: ['goat',
                    'bloat',
                    'boat',
                    'choat',
                    'choate',
                    'coat',
                    'cote',
                    'dote',
                    'float',
                    'gloat',
                    'groat',
                    'grote',
                    'haute',
                    'hote',
                    'kote',
                    'moat',
                    'mote',
                    'note',
                    'oat',
                    'pote',
                    'quote',
                    'roat',
                    'rote',
                    'schaut',
                    'sloat',
                    'sloate',
                    'sproat',
                    'throat',
                    'tote',
                    'vogt',
                    'vote',
                    'wrote'],
                name: 'Soraka',
                icon: 16
            },
            {
                id: ['swing',
                    'swim',
                    'swin',
                    'aine',
                    'ane',
                    'ayn',
                    'bain',
                    'baine',
                    'bane',
                    'bayne',
                    'blain',
                    'blaine',
                    'blane',
                    'blayne',
                    'brain',
                    'cain',
                    'caine',
                    'cane',
                    'cayne',
                    'chain',
                    'cheyne',
                    'crain',
                    'craine',
                    'crane',
                    'crayne',
                    'dain',
                    'dane',
                    'dayne',
                    'deign',
                    'drain',
                    'draine',
                    'drane',
                    'duan',
                    'duane',
                    'dwayne',
                    'fain',
                    'fane',
                    'fayne',
                    'feign',
                    'fein',
                    'frain',
                    'fraine',
                    'frane',
                    'frayn',
                    'frayne',
                    'frein',
                    'freyne',
                    'gain',
                    'grain',
                    'grein',
                    'hahne',
                    'hain',
                    'hane',
                    'hayn',
                    'hayne',
                    'heyn',
                    'heyne',
                    'jain',
                    'jane',
                    'jayne',
                    'kain',
                    'kaine',
                    'kane',
                    'kayne',
                    'krain',
                    'krane',
                    'krein',
                    'lain',
                    'laine',
                    'lane',
                    'layne',
                    'ln',
                    'main',
                    'maine',
                    'mane',
                    'mayne',
                    'meyn',
                    'paign',
                    'pain',
                    'paine',
                    'pane',
                    'payne',
                    'plain',
                    'plane',
                    'quain',
                    'rain',
                    'raine',
                    'rayne',
                    'reign',
                    'rein',
                    'reine',
                    'sain',
                    'saine',
                    'sane',
                    'shain',
                    'shaine',
                    'shane',
                    'shayne',
                    'skein',
                    'slain',
                    'slaine',
                    'slane',
                    'spain',
                    'splain',
                    'splaine',
                    'sprain',
                    'stain',
                    'strain',
                    'swaine',
                    'swayne',
                    'thain',
                    'thaine',
                    'thane',
                    'thayne',
                    'train',
                    'trane',
                    'twain',
                    'vain',
                    'vane',
                    'vein',
                    'veyne',
                    'vrain',
                    'wain',
                    'wane',
                    'wayne',
                    'zane'],
                name: 'Swain',
                icon: 50
            },
            {id: [''], name: 'Syndra', icon: 134},
            {
                id: ['tom can\'t', 'tomkins', 'punk inch', 'thompkins'],
                name: 'Tahm Kench',
                icon: 223
            },
            {
                id: ['telling',
                    'alan',
                    'allan',
                    'allen',
                    'ballon',
                    'callan',
                    'callen',
                    'dalen',
                    'fallon',
                    'gallon',
                    'mallon',
                    'malon',
                    'palen',
                    'phalen',
                    'scallan',
                    'scallon',
                    'tallon'],
                name: 'Talon',
                icon: 91
            },
            {
                id: ['tara',
                    'tarak',
                    'touring',
                    'pirate',
                    'bara',
                    'barra',
                    'beara',
                    'bera',
                    'berra',
                    'cara',
                    'carra',
                    'cera',
                    'cerra',
                    'chara',
                    'chiara',
                    'clara',
                    'darragh',
                    'era',
                    'erra',
                    'farah',
                    'farra',
                    'farrah',
                    'fera',
                    'ferra',
                    'gera',
                    'guerra',
                    'hara',
                    'harra',
                    'jara',
                    'kara',
                    'kera',
                    'lara',
                    'leora',
                    'mara',
                    'marra',
                    'naira',
                    'nara',
                    'neira',
                    'para',
                    'parra',
                    'rara',
                    'sara',
                    'sarah',
                    'sarra',
                    'sciara',
                    'serra',
                    'sferra',
                    'shara',
                    'sharaa',
                    'spera',
                    'terra',
                    'terre',
                    'thera',
                    'vara',
                    'vera',
                    'waara',
                    'zera'],
                name: 'Taric',
                icon: 44
            },
            {
                id: ['timo',
                    'bmo',
                    'devil',
                    'demon',
                    'bevel',
                    'bevil',
                    'bevill',
                    'devoll',
                    'evel',
                    'level',
                    'revel'],
                name: 'Teemo',
                icon: 17
            },
            {
                id: ['thrush',
                    'besch',
                    'creche',
                    'desch',
                    'dresch',
                    'esch',
                    'esche',
                    'esh',
                    'flesch',
                    'flesh',
                    'fresh',
                    'gresh',
                    'hesch',
                    'klesch',
                    'lesch',
                    'lesh',
                    'mesch',
                    'mesh',
                    'pesch',
                    'pesh',
                    'resch',
                    'resh',
                    'tesch',
                    'tesh',
                    'tresch',
                    'wesch',
                    'wesche'],
                name: 'Thresh',
                icon: 412
            },
            {id: ['to astana', 'to start a'], name: 'Tristana', icon: 18},
            {
                id: ['',
                    'blundall',
                    'blundell',
                    'bundle',
                    'cundall',
                    'gundel',
                    'gundle',
                    'lundell',
                    'mundell',
                    'rundall',
                    'rundell',
                    'rundle',
                    'sundell',
                    'zundel'],
                name: 'Trundle',
                icon: 48
            },
            {id: [''], name: 'Tryndamere', icon: 23},
            {id: ['ts', 'tf', 'vs'], name: 'Twisted Fate', icon: 4},
            {
                id: ['',
                    'bitch',
                    'blitch',
                    'britsch',
                    'ditch',
                    'fitch',
                    'fritch',
                    'fritsch',
                    'fritsche',
                    'fritzsche',
                    'glitch',
                    'hitch',
                    'ich',
                    'itch',
                    'kitch',
                    'kitsch',
                    'klich',
                    'krych',
                    'lich',
                    'mich',
                    'mitch',
                    'mitsch',
                    'niche',
                    'nitsch',
                    'nitsche',
                    'nycz',
                    'piche',
                    'pitch',
                    'pitsch',
                    'rich',
                    'riche',
                    'ritch',
                    'snitch',
                    'stich',
                    'stitch',
                    'switch',
                    'triche',
                    'tritch',
                    'tritsch',
                    'which',
                    'wich',
                    'witch',
                    'zich'],
                name: 'Twitch',
                icon: 29
            },
            {
                id: ['you dear', 'to deer', 'of deer', 'of year'],
                name: 'Udyr',
                icon: 77
            },
            {
                id: ['i got',
                    'forgot',
                    'got',
                    'baht',
                    'bhatt',
                    'blot',
                    'bott',
                    'bought',
                    'brott',
                    'caught',
                    'clot',
                    'clott',
                    'cot',
                    'cott',
                    'dot',
                    'dott',
                    'flott',
                    'gott',
                    'hot',
                    'hott',
                    'jot',
                    'khat',
                    'knot',
                    'knott',
                    'kot',
                    'kott',
                    'lat',
                    'lot',
                    'lott',
                    'lotte',
                    'mott',
                    'motte',
                    'not',
                    'nott',
                    'notte',
                    'ott',
                    'otte',
                    'plot',
                    'plott',
                    'pot',
                    'pott',
                    'rot',
                    'rott',
                    'schaadt',
                    'schlott',
                    'schott',
                    'schrodt',
                    'scot',
                    'scott',
                    'shot',
                    'shott',
                    'slot',
                    'slott',
                    'spot',
                    'sprott',
                    'squat',
                    'staat',
                    'stott',
                    'swat',
                    'szot',
                    'szott',
                    'tot',
                    'trot',
                    'trott',
                    'voght',
                    'watt',
                    'yacht',
                    'yott'],
                name: 'Urgot',
                icon: 6
            },
            {
                id: ['various', 'virus', 'there is', 'marius'],
                name: 'Varus',
                icon: 110
            },
            {
                id: ['then',
                    'vain',
                    'behn',
                    'behne',
                    'ben',
                    'benn',
                    'benne',
                    'bren',
                    'brenn',
                    'chen',
                    'chien',
                    'dehn',
                    'dehne',
                    'den',
                    'denn',
                    'denne',
                    'en',
                    'fehn',
                    'fen',
                    'fenn',
                    'gen',
                    'glen',
                    'glenn',
                    'gren',
                    'gwen',
                    'hehn',
                    'hen',
                    'henn',
                    'henne',
                    'hren',
                    'jen',
                    'jenn',
                    'jenne',
                    'kehn',
                    'kehne',
                    'ken',
                    'kenn',
                    'kren',
                    'krenn',
                    'lehn',
                    'lehne',
                    'len',
                    'men',
                    'menn',
                    'menne',
                    'n',
                    'n.',
                    'pen',
                    'penh',
                    'penn',
                    'phen',
                    'prehn',
                    'prenn',
                    'rehn',
                    'ren',
                    'renn',
                    'renne',
                    'schwenn',
                    'sen',
                    'senn',
                    'senne',
                    'shen',
                    'sten',
                    'sven',
                    'ten',
                    'tenn',
                    'tien',
                    'venn',
                    'venne',
                    'wen',
                    'when',
                    'wren',
                    'wrenn',
                    'yen',
                    'yene',
                    'yuen',
                    'zen'],
                name: 'Vayne',
                icon: 67
            },
            {id: [''], name: 'Veigar', icon: 45},
            {
                id: ['will cause', 'thought cause', 'tentacles'],
                name: 'Vel\'Koz',
                icon: 161
            },
            {
                id: ['by',
                    'the',
                    'i',
                    'ai',
                    'ay',
                    'aye',
                    'b',
                    'b.',
                    'bae',
                    'be',
                    'bea',
                    'bee',
                    'bi',
                    'blea',
                    'bligh',
                    'bly',
                    'blye',
                    'brea',
                    'bree',
                    'brie',
                    'brye',
                    'bui',
                    'buie',
                    'buy',
                    'by',
                    'bye',
                    'c',
                    'c.',
                    'cai',
                    'chae',
                    'chai',
                    'chea',
                    'chee',
                    'chi',
                    'cie',
                    'crea',
                    'cree',
                    'cry',
                    'crye',
                    'cy',
                    'd',
                    'd.',
                    'dai',
                    'de',
                    'dea',
                    'dee',
                    'di',
                    'die',
                    'dry',
                    'drye',
                    'dye',
                    'e',
                    'e.',
                    'ee',
                    'eye',
                    'fae',
                    'fee',
                    'fi',
                    'flea',
                    'flee',
                    'fly',
                    'flye',
                    'free',
                    'freeh',
                    'frei',
                    'fry',
                    'frye',
                    'fsi',
                    'fye',
                    'g',
                    'g.',
                    'gae',
                    'gee',
                    'ghee',
                    'glee',
                    'guy',
                    'gyi',
                    'he',
                    'hee',
                    'heye',
                    'hi',
                    'high',
                    'hy',
                    'i',
                    'i.',
                    'jai',
                    'je',
                    'jee',
                    'ji',
                    'jie',
                    'kai',
                    'kea',
                    'kee',
                    'key',
                    'keye',
                    'khe',
                    'ki',
                    'klee',
                    'knee',
                    'kwai',
                    'kyi',
                    'lai',
                    'lea',
                    'lee',
                    'leigh',
                    'li',
                    'lie',
                    'lxi',
                    'ly',
                    'lye',
                    'mai',
                    'me',
                    'mea',
                    'mee',
                    'mei',
                    'mi',
                    'my',
                    'ne',
                    'nee',
                    'ngai',
                    'nghi',
                    'ni',
                    'nie',
                    'nigh',
                    'nye',
                    'oui',
                    'p',
                    'p.',
                    'pae',
                    'pea',
                    'peay',
                    'pee',
                    'phi',
                    'phy',
                    'pi',
                    'pie',
                    'plea',
                    'ply',
                    'pre',
                    'pree',
                    'pri',
                    'prix',
                    'pry',
                    'psi',
                    'pty',
                    'pye',
                    'qi',
                    'quai',
                    'quay',
                    'qui',
                    're',
                    'ree',
                    'reeh',
                    'rhee',
                    'rye',
                    'sai',
                    'schlee',
                    'schlie',
                    'schnee',
                    'sci',
                    'sea',
                    'see',
                    'shai',
                    'she',
                    'shi',
                    'shieh',
                    'shih',
                    'shri',
                    'shy',
                    'si',
                    'sie',
                    'sieh',
                    'sigh',
                    'ski',
                    'sky',
                    'slee',
                    'sligh',
                    'sly',
                    'slye',
                    'smee',
                    'snee',
                    'spie',
                    'spree',
                    'spry',
                    'spy',
                    'sri',
                    'sty',
                    'sy',
                    'sze',
                    't',
                    't.',
                    'tae',
                    'tai',
                    'te',
                    'tea',
                    'tee',
                    'thai',
                    'thee',
                    'thi',
                    'thigh',
                    'three',
                    'thy',
                    'ti',
                    'tie',
                    'tree',
                    'tri',
                    'trie',
                    'try',
                    'tsai',
                    'tse',
                    'ty',
                    'tye',
                    'v',
                    'v.',
                    've',
                    'vee',
                    'vie',
                    'vy',
                    'wai',
                    'we',
                    'wee',
                    'why',
                    'wiehe',
                    'wry',
                    'wrye',
                    'wye',
                    'xi',
                    'xie',
                    'y',
                    'y.',
                    'ye',
                    'yee',
                    'yi',
                    'yie',
                    'z',
                    'z.',
                    'ze',
                    'zea',
                    'zee',
                    'zi'],
                name: 'Vi',
                icon: 254
            },
            {
                id: ['victor',
                    'dichter',
                    'fichter',
                    'fiechter',
                    'lichter',
                    'nichter',
                    'richter',
                    'schlichter',
                    'stichter',
                    'stricter',
                    'victor'],
                name: 'Viktor',
                icon: 112
            },
            {
                id: ['lighted mirror',
                    'gladimir',
                    'glad',
                    'lag',
                    'ad',
                    'add',
                    'bad',
                    'brad',
                    'cad',
                    'chad',
                    'chadd',
                    'clad',
                    'dad',
                    'fad',
                    'flad',
                    'gad',
                    'gadd',
                    'gladd',
                    'grad',
                    'had',
                    'hadd',
                    'hlad',
                    'khad',
                    'lad',
                    'ladd',
                    'mad',
                    'madd',
                    'nad',
                    'pad',
                    'plaid',
                    'rad',
                    'radde',
                    'sad',
                    'scad',
                    'schad',
                    'shad',
                    'shadd',
                    'tad',
                    'tadd',
                    'thad',
                    'vlad'],
                name: 'Vladimir',
                icon: 8
            },
            {id: ['polar bears', 'polar bear', 'boulevard'], name: 'Volibear', icon: 106},
            {
                id: ['war with', 'horwich', 'orwick'],
                name: 'Warwick',
                icon: 19
            },
            {
                id: ['uconn',
                    'you can',
                    'will come',
                    'welcome',
                    'balking',
                    'chalking',
                    'chalking',
                    'gawking',
                    'hawking',
                    'squawking',
                    'stalking',
                    'talking',
                    'monkey',
                    'chunky',
                    'clunky',
                    'funky',
                    'hunky',
                    'junkie',
                    'junky',
                    'punky',
                    'spunky'],
                name: 'Wukong',
                icon: 62
            },
            {
                id: ['is there is', 'there is', '0', 'exeris', 'exist'],
                name: 'Xerath',
                icon: 101
            },
            {
                id: ['in a',
                    'in 0',
                    'jinjo',
                    'to enjoy',
                    'you enjoy',
                    'is anzo',
                    'since i\'ll',
                    'runs out'],
                name: 'Xin Zhao',
                icon: 5
            },
            {
                id: ['yeah so',
                    'yes or',
                    'you saw a',
                    'yahoo',
                    'is all',
                    'you so',
                    'yes it will',
                    'yahshua',
                    'lol'],
                name: 'Yasuo',
                icon: 157
            },
            {id: ['you\'re it', 'your ex', 'jordan', 'your a', 'your', 'you\'re a'], name: 'Yorick', icon: 83},
            {
                id: ['black',
                    'a',
                    'back',
                    'sack',
                    'sac',
                    'yack',
                    'yak',
                    'zack',
                    'zak'],
                name: 'Zac',
                icon: 154
            },
            {
                id: ['led',
                    'and',
                    'dead',
                    'said',
                    'bed',
                    'bled',
                    'bread',
                    'bred',
                    'dead',
                    'dread',
                    'dred',
                    'dredd',
                    'ed',
                    'fed',
                    'fled',
                    'fread',
                    'fred',
                    'freda',
                    'ged',
                    'head',
                    'jed',
                    'lead',
                    'led',
                    'med',
                    'ned',
                    'nedd',
                    'pled',
                    'read',
                    'reade',
                    'red',
                    'redd',
                    'said',
                    'schwed',
                    'sffed',
                    'shead',
                    'shed',
                    'shedd',
                    'shred',
                    'sled',
                    'sledd',
                    'sped',
                    'spread',
                    'stead',
                    'swed',
                    'szwed',
                    'ted',
                    'thread',
                    'tread',
                    'wed',
                    'wedd',
                    'wehde'],
                name: 'Zed',
                icon: 238
            },
            {id: [''], name: 'Ziggs', icon: 115},
            {
                id: ['alien', 'zillion', 'balian', 'dalian'],
                name: 'Zilean',
                icon: 26
            },
            {
                id: ['zara',
                    'zero',
                    'ira',
                    'ara',
                    'clara',
                    'dara',
                    'darrah',
                    'gara',
                    'harrah',
                    'jarrod',
                    'schara',
                    'zarah'],
                name: 'Zyra',
                icon: 143
            }]

});

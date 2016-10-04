app.controller('middleController', function ($scope) {
    $scope.enemyList = {};
});

$(document).ready(function () {
    $('.runes').hover(
        function () {
            $(this).find('ul').css('display', 'block')
        },
        function () {
            $(this).find('ul').css('display', 'none')
        }
    )
});

$(document).ready(function () {
    var enemyTeam = $("#uidEnemy").html();
    var staticMasteries = $("#uid_masStatic").html();
    enemyTeam = JSON.parse(enemyTeam);
    staticMasteries = JSON.parse(staticMasteries);
    for (var z = 0; z < enemyTeam.length; z++) {

        for (var zz = 0; zz < enemyTeam[z]['masteryIds'].length; zz++) {

            var masteryWrapper = $('.enemy').eq(z);
            var masteryInit = enemyTeam[z]['masteryIds'][zz]['masteryId'];
            var masteryRank = enemyTeam[z]['masteryIds'][zz]['rank'];
            var masteryDesc = staticMasteries[masteryInit.toString()]['description'][masteryRank - 1];
            var masteryRef = masteryWrapper.find('.points');

            for (var zzz = 0; zzz < masteryRef.length; zzz++) {
                if (masteryInit == masteryRef.eq(zzz).attr('id')) {
                    if (masteryInit == '6241') masteryWrapper.find('.player-sector-distortion').data('insight', true);
                    var masteryRankCont = masteryWrapper.find('.points').eq(zzz).text().replace('0', masteryRank);
                    masteryWrapper.find('.points').eq(zzz).text(masteryRankCont);
                    masteryWrapper.find('.item-description').eq(zzz).text(masteryDesc);
                    masteryWrapper.find('.talent-icon-container').eq(zzz).toggleClass('icon-active');
                    masteryWrapper.find('.points').eq(zzz).toggleClass('points-active');
                    masteryWrapper.find('.sprite').eq(zzz).css('background-position-y', 0);
                }
            }
        }

    }
});
$(document).ready(function () {
    var allyTeam = $("#uidAlly").html();
    var staticMasteries = $("#uid_masStatic").html();
    allyTeam = JSON.parse(allyTeam);
    staticMasteries = JSON.parse(staticMasteries);
    for (var z = 0; z < allyTeam.length; z++) {

        for (var zz = 0; zz < allyTeam[z]['masteryIds'].length; zz++) {

            var masteryWrapper = $('.ally').eq(z);
            var masteryInit = allyTeam[z]['masteryIds'][zz]['masteryId'];
            var masteryRank = allyTeam[z]['masteryIds'][zz]['rank'];
            var masteryDesc = staticMasteries[masteryInit.toString()]['description'][masteryRank - 1];
            var masteryRef = masteryWrapper.find('.points');

            for (var zzz = 0; zzz < masteryRef.length; zzz++) {
                if (masteryInit == masteryRef.eq(zzz).attr('id')) {
                    if (masteryInit == '6241') masteryWrapper.find('.player-sector-distortion').data('insight', true);
                    var masteryRankCont = masteryWrapper.find('.points').eq(zzz).text().replace('0', masteryRank);
                    masteryWrapper.find('.points').eq(zzz).text(masteryRankCont);
                    masteryWrapper.find('.item-description').eq(zzz).text(masteryDesc);
                    masteryWrapper.find('.talent-icon-container').eq(zzz).toggleClass('icon-active');
                    masteryWrapper.find('.points').eq(zzz).toggleClass('points-active');
                    masteryWrapper.find('.sprite').eq(zzz).css('background-position-y', 0);
                }
            }
        }

    }
});
$(document).ready(function () {
    var tips = $('.talent-icon-container');
    for (var i = 0; i < tips.length; i++) {
        var header = tips.eq(i).find('h2').text();
        var desc = tips.eq(i).find('.item-description').text();
        desc = desc.split('&lt;br&gt;&lt;br&gt;').join(' ');
        new Opentip(tips.eq(i), desc, header, {style: 'glass'});
        Opentip.lastZIndex = 9999;
    }
});

function startTimer(ssName, champName) {
    var scope = angular.element(document.getElementById("rightWrap")).scope();
    scope.timerStart(ssName, champName);
}

var clink = document.createElement('audio');
clink.setAttribute('src', '../sounds/clink.wav');
clink.volume = 0.3;

var toggleDistortionInit = function (int) {
    var scope = angular.element(document.getElementById("rightWrap")).scope();
    var idx = $('.player-sector-distortion').index(int);
    idx = idx + 1;
    if ($('.tut-3').css('display') == 'none')scope.distortionToggleId(idx.toString());
};
var toggleLucidityInit = function (int) {
    var scope = angular.element(document.getElementById("rightWrap")).scope();
    var idx = $('.player-sector-lucidity').index(int);
    idx = idx + 1;
    scope.lucidityToggleId(idx.toString());
};
var toggleDistortion = function (int) {
    $(int).toggleClass('distortion-active');
    if ($(int).data('distortion') === false) {
        $(int).data('distortion', true);
        $(int).find('.player-sector-distortion-enchant').fadeIn('fast');
        clink.play();
    } else {
        $(int).data('distortion', false);
        $(int).find('.player-sector-distortion-enchant').fadeOut('fast');
    }
};
var toggleLucidity = function (int) {
    $(int).toggleClass('lucidity-active');
    if ($(int).data('lucidity') === false) {
        $(int).data('lucidity', true);
    } else {
        $(int).data('lucidity', false);
    }
};

$(document).ready(function () {
    var runes = $('.runes');
    for (var i = 0; i < runes.length; i++) {

        for (var ii = 0; ii < runes.eq(i).find('a').length; ii++) {
            var b = runes.eq(i).find('a').eq(ii);
            var runeInit = b.text().replace(/[0-9.]/g, '');

            for (var iii = 0; iii < runes.eq(i).find('a').length; iii++) {
                var c = runes.eq(i).find('a').eq(iii);
                var runeInitNext = c.text().replace(/[0-9.]/g, '');

                if (runeInitNext == runeInit && iii != ii) {

                    if (parseInt(b.text().split(' ').shift()) > parseInt(c.text().split(' ').shift())) {

                        c.remove();
                    }
                }
            }
        }
    }
});


$(document).ready(function () {
    var enemy = document.getElementById('enemySort');
    var ally = document.getElementById('allySort');
    Sortable.create(enemy, {
        handle: ".handledrag",
        animation: 150,
        onUpdate: function () {
            for (var i = 0; i < $('.player-sector.enemy').length; i++) {
                $('.player-sector.enemy').eq(i).find('.player-sector-summoner-enemy').text('Summoner ' + (i + 1));
            }
        }
    });
    Sortable.create(ally, {
        handle: ".handledrag",
        animation: 150,
        onUpdate: function () {
            for (var i = 0; i < $('.player-sector.ally').length; i++) {
                $('.player-sector.ally').eq(i).find('.player-sector-summoner-ally').text('Summoner ' + (i + 6));
            }
        }
    });
});

$(document).ready(function () {

    var actions = $('.action');
    var cd;

// Request animationFrame

    window.requestAnimationFrame = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    function Cooldown(el) {

        this.canvas = el.querySelector('canvas');
        this.cd = cd;
        this.ctx = this.canvas.getContext('2d');
        this.element = el;
        this.timer;
        this.timerStart;

        this.clearCanvas = function () {
            this.ctx.setTransform(1, 0, 0, 1, 0, 0);
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        };

        this.endCooldown = function () {
            this.clearCanvas();
            this.timer = null;

            var canvas = this.canvas;
            var ctx = this.canvas.getContext('2d');
            ctx.fillStyle = 'rgba(253, 255, 173, 0.5)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            window.setTimeout(function () {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }, 20);
        };

        this.gaugeCooldown = function (el) {
            if (!this.timer) {
                this.initiateCooldown(el);
            }
        };
        var scope = angular.element(document.getElementById("rightWrap")).scope();
        this.initiateCooldown = function (el) {
            var actionId = $(el).find('img').attr('id');
            var summonerList = scope.summonerSpells;
            for (var i = 0; i < summonerList.length; i++) {
                if (actionId == summonerList[i].icon) {
                    this.cd = summonerList[i].duration * 1000;
                }
            }
            if (!this.timer) {
                this.timer = window.setTimeout(this.endCooldown.bind(this), this.cd);
                this.timerStart = (new Date()).getTime();
                this.runCooldown();
            }
        };

        this.runCooldown = function () {
            if (this.timer) {
                var timeElapsed = (new Date()).getTime() - this.timerStart;
                var timeElapsedPercentage = timeElapsed / this.cd;
                var degrees = 360 * timeElapsedPercentage;

                var canvas = this.canvas;
                var ctx = this.canvas.getContext('2d');
                var hypoteneuse = Math.sqrt(Math.pow(this.element.clientWidth, 2) + Math.pow(this.element.clientHeight, 2));
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                canvas.height = hypoteneuse;
                canvas.width = hypoteneuse;

                canvas.style.marginLeft = -hypoteneuse / 2 + "px";
                canvas.style.marginTop = -hypoteneuse / 2 + "px";

                ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';

                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.rotate(-Math.PI / 2);

                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo((hypoteneuse / 2) * Math.cos(0).toFixed(15), (hypoteneuse / 2) * Math.sin(0).toFixed(15));
                ctx.lineWidth = 2;
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';

                ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
                ctx.shadowBlur = 10;

                ctx.stroke();
                ctx.moveTo(0, 0);
                ctx.lineTo((hypoteneuse / 2) * Math.cos(degrees * Math.PI / 180).toFixed(15), (hypoteneuse / 2) * Math.sin(degrees * Math.PI / 180).toFixed(15));
                ctx.stroke();

                ctx.shadowColor = null;
                ctx.shadowBlur = null;

                ctx.arc(0, 0, hypoteneuse / 2, degrees * Math.PI / 180, Math.PI * 2, false);
                ctx.fill();
                ctx.closePath();

                requestAnimationFrame(this.runCooldown.bind(this));
            }
        };
    }

    Array.prototype.forEach.call(actions, function (el, i) {
        var action = new Cooldown(el);
        $(el).on('click', function () { //start-anim with click
            action.gaugeCooldown(el);
        });
        $(el).on('clearAnimation', function () {
            action.endCooldown(el);
        });
        $(el).on('voiceTrigger', function () { //start-anim with voice
            action.gaugeCooldown(el);
        });
    });
});
var updateCont = function (el) {
    var scope = angular.element(document.getElementById("rightWrap")).scope();
    var timerId = el.attr('id');
    var idx = $('.tmr').index(el);
    var middleSSId = $('.' + timerId);
    middleSSId.trigger('clearAnimation');
    scope.$apply(function () {
        scope.timerSurface.splice(idx, 1);
    });

};
$(document).ready(function () {
    $('.cs-ticker').click(function () {
        $(this).find('span').toggleClass('fa-pause');
    });
});

$(document).on('keyup', function (e) {
    if (e.which == 32) {
        $('.control').toggleClass('pause play');
    }
});
//cs-ticker sequence
$(document).ready(function () {
    var audioElement = document.createElement('audio');
    audioElement.setAttribute('src', '../sounds/tick.wav');

    function tickInterval() {
        var tickerDelay = $('.cs-ticker-input').val().split('s');
        tickerDelay = parseInt(tickerDelay) * 1000;
        audioElement.volume = $('.cs-ticker-volume').val() / 100;
        if ($('.cs-ticker').attr('class') == 'cs-ticker active') {
            $('.cs-ticker').toggleClass('active-tick');
            audioElement.play();
            setTimeout(function () {
                $('.cs-ticker').toggleClass('active-tick');
            }, 500);
        }
        setTimeout(function () {
            tickInterval();
        }, tickerDelay);
    }

    tickInterval();
});
//cs-ticker toggle active
$(document).ready(function () {
    $('.cs-ticker').click(function () {
        $(this).toggleClass('active');
    })
});
//cw-timer constructor
String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    var time = hours + ':' + minutes + ':' + seconds;
    return time;
};

$(document).ready(function () {
    var rawTime = $('.cw-timer-time').text();

    //check if rito timing us spaghet
    if (rawTime == 0) {
        $('.cw-timer-time').text('');
        $('.cw-refresh').hover(function () {
            $(this).toggleClass('fa-spin');
        });
        $('.cw-refresh').fadeIn('slow');
        $('.cw-refresh').click(function () {
            location.reload();
        });
        return;
    }

    rawTime = parseInt(rawTime) + 180;
    var timeCon = rawTime.toString().toHHMMSS();
    timeCon = timeCon.replace(/^[^1-9]*/, '');
    $('.cw-timer-time').text(timeCon);
    function cwSequence() {
        if (((rawTime - 135) % 90) == 0 && $('#slider8').prop('checked')) {
            //cannon wave has just spawned!
            var msg = new SpeechSynthesisUtterance('a cannon wave has just spawned!');
            msg.lang = 'en-US';
            msg.volume = $('.voice-assist-volume').val() / 100;
            window.speechSynthesis.speak(msg);
        }
        rawTime = rawTime + 1;
        timeCon = rawTime.toString().toHHMMSS();
        timeCon = timeCon.replace(/^[^1-9]*/, '');
        $('.cw-timer-time').text(timeCon);
        setTimeout(function () {
            cwSequence();
        }, 1000)
    }

    cwSequence();
});
//middle-container resize event --> hide playername
$(window).resize(function () {
    if ($('.middle-container').width() < 1280) $('.player-sector-name').css('visibility', 'hidden'); else $('.player-sector-name').css('visibility', 'visible');
});
$(document).ready(function () {
    if ($('.middle-container').width() < 1280) $('.player-sector-name').css('visibility', 'hidden');
});


$(document).ready(function () {
    $('.middle-wrapper').TrackpadScrollEmulator();
});

//click to collapse unsupported footer
$(document).ready(function () {
    $('.unsupported').click(function () {
        $('.unsupported').fadeOut();
    });
});
//sent to op.gg
$(document).ready(function () {
    $('.player-sector-name').click(function () {
        var playerName = $(this).text();
        var url = window.location.href;
        var reg = url.split('/').pop();
        reg = reg + '.';
        playerName = decodeURI(playerName);
        if (reg == 'kr.') reg = '';
        window.location.href = 'http://' + reg + 'op.gg/summoner/userName=' + playerName;
    });
});
//tutorial handler
$(document).ready(function () {

    var tut1 = localStorage.getItem('tut-1');
    if (tut1 != 'true') $('.tut-1').fadeIn();
    var tut2 = localStorage.getItem('tut-2');
    if (tut2 != 'true') $('.tut-2').fadeIn();
    var tut3 = localStorage.getItem('tut-3');
    if (tut3 != 'true') $('.tut-3').fadeIn();
    var tut4 = localStorage.getItem('tut-4');
    if (tut4 != 'true') $('.tut-4').fadeIn();
    var tut5 = localStorage.getItem('tut-5');
    if (tut5 != 'true') $('.tut-5').fadeIn();

    $('.tut-badge').click(function () {
        $('.tutorial-notification').fadeOut();
        $(this).next().fadeIn();
    });
    $('.next').click(function () {
        $('.mic-warning').fadeOut();
        var active = $('.tutorial-panel.active');
        var activeNext = active.next();
        if (active.attr('id') == 4) {
            $('.next').text('I\'m Ready');
            $('.skip').css('display', 'none');
        }
        if (active.attr('id') != 5) {
            active.find('.tutorial-body').animate({right: '300px', opacity: '0'}, 'slow', 'swing', function () {
                $(this).css({'right': '0', 'opacity': '1'});
            });
            active.find('.tutorial-header').animate({right: '300px', opacity: '0'}, 'slow', 'swing', function () {
                $(this).css({'right': '0', 'opacity': '1'});
            });
            setTimeout(function () {
                active.toggleClass('active');
                activeNext.toggleClass('active');
            }, 500);

        } else {
            $('#tutorial').modal('hide');
        }
    });
    $('#tutorial').on('hidden.bs.modal', function () {
        $('.mic-warning').fadeOut();
        $('.tutorial-panel').removeClass('active');
        var first = $('.tutorial-panel:first-of-type');
        first.addClass('active');
        $('.skip').css('display', 'inline-block');
        $('.next').text('Next');
    });
    $('.tut-close').click(function () {
        var badgeNum = $(this).parent().parent().parent().attr('class');
        localStorage.setItem(badgeNum, true);
        $(this).parent().parent().parent().find('.tut-badge').fadeOut();
        $(this).parent().parent().parent().find('.tutorial-notification').fadeOut();
    });
    $('.tip-skip').click(function () {
        localStorage.setItem('tut-1', true);
        localStorage.setItem('tut-2', true);
        localStorage.setItem('tut-3', true);
        localStorage.setItem('tut-4', true);
        localStorage.setItem('tut-5', true);
        $('.tut-1').fadeOut();
        $('.tut-2').fadeOut();
        $('.tut-3').fadeOut();
        $('.tut-4').fadeOut();
        $('.tut-5').fadeOut();

    });
});
$(document).click(function (event) {
    if (!$(event.target).closest('.tutorial-notification').length && !$(event.target).is('.tutorial-notification') && !$(event.target).is('.tut-badge')) {
        if ($('.tutorial-notification').is(":visible")) {
            $('.tutorial-notification').fadeOut();
        }
    }
});

//phonetics reference handler
$(document).ready(function () {
    $('.player-sector-champ-icon').click(function () {
        var classStr = $(this).attr('class');
        var scope = angular.element(document.getElementById("rightWrap")).scope();
        if (classStr.indexOf('champ-icon-recording') > -1) {
            $(this).removeClass('champ-icon-recording');
            scope.currentChampionIdRef = '';
            return;
        }
        $('.player-sector-champ-icon').removeClass('champ-icon-recording');
        var listIdx = $('.player-sector-champ-icon').index(this);
        var champId = $('.player-sector-distortion').eq(listIdx).data('champid');
        $(this).toggleClass('champ-icon-recording');
        console.log($(this).attr('class'));
        var msg = new SpeechSynthesisUtterance('recording alias');
        scope.timerWarning(msg);
        scope.currentChampionIdRef = champId;
    });
});

function getFileExtension(i) {

    // i will be a string, but it may not have a file extension.
    // return the file extension (with no period) if it has one, otherwise false

    return (i.split('.').pop());


}


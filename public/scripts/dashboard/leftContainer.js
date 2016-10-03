//adBlockCheck

var app = angular.module('app', []);

app.controller('leftController', function ($scope) {

    $scope.sections = [
        {
            id: 1,
            header: 'settings',
            icon: 'glyphicon glyphicon-cog',
            options: [
                {id: 1, name: 'microphone'},
                {id: 2, name: 'voice assist'},
                {id: 3, name: 'language'},
                {id: 4, name: 'ticker'},
            ]
        },
        {
            id: 2,
            header: 'extras',
            icon: 'glyphicon glyphicon-list',
            css: 'extra-instance',
            options: [
                {id: 5, name: 'ally team'},
                {id: 6, name: 'map ticker'},
                {id: 7, name: 'map display'},
                {id: 8, name: 'cw notifier'},
                {id: 9, name: 'night mode'}
            ]
        },
        {
            id: 3,
            header: 'voice commands',
            icon: 'glyphicon glyphicon-volume-up',
            css: 'command-list'
        },
        {
            id: 4,
            header: 'tutorial',
            icon: 'glyphicon glyphicon-briefcase',
            css: 'issue-tutorial'
        }
    ];
    //ally team toggle
    $(document).ready(function () {
        $scope.$apply(function () {
            $('#slider5').change(function () {
                if ($(this).prop('checked')) $('.ally').fadeIn(); else $('.ally').fadeOut();
            });
        });
    });
    //cs ticker toggle
    $(document).ready(function () {
        $scope.$apply(function () {
            $('#slider6').change(function () {
                if (isExtraEmpty()) $('.extra-container').css('display', 'none'); else $('.extra-container').css('display', 'flex');
                if ($(this).prop('checked')) {
                    $('.cs-ticker').fadeIn();
                    $('.cs-ticker').attr('class', 'cs-ticker active');
                    $('.cs-ticker').css('display', 'table');
                } else {
                    $('.cs-ticker').fadeOut();
                    $('.cs-ticker').attr('class', 'cs-ticker');
                }
            });
        });
    });
    //map toggle
    $(document).ready(function () {
        $scope.$apply(function () {
            $('#slider7').change(function () {
                if (isExtraEmpty()) $('.extra-container').css('display', 'none'); else $('.extra-container').css('display', 'flex');
                if ($(this).prop('checked')) $('.map-container').fadeIn(); else $('.map-container').fadeOut();
            });
        });
    });
    //cw notifier toggle
    $(document).ready(function () {
        $scope.$apply(function () {
            $('#slider8').change(function () {
                if (isExtraEmpty()) $('.extra-container').css('display', 'none'); else $('.extra-container').css('display', 'flex');
                if ($(this).prop('checked')) {
                    $('.cw-timer').fadeIn();
                    $('.cw-timer').css('display', 'table');
                } else {
                    $('.cw-timer').fadeOut();
                }
            });
        });
    });
    //night mode toggle
    $(document).ready(function () {
        $scope.$apply(function () {
            $('#slider9').change(function () {
                var playerSect = $('.player-sector');
                var middleCont = $('.middle-container');
                var allyNames = $('.player-sector-summoner-ally');
                var enemyNames = $('.player-sector-summoner-enemy');
                var divider = $('.divider');
                var jumbo = $('.jumbotron');
                if ($(this).prop('checked')) {
                    middleCont.css('background-color', '#333');
                    playerSect.css('background-color', '#222');
                    allyNames.css('color', '#535559');
                    enemyNames.css('color', '#535559');
                    playerSect.css('border-bottom', 'none');
                    playerSect.css('border-top', 'none');
                    playerSect.css('border-right', 'none');
                    playerSect.css('box-shadow', 'none');
                    divider.css('border-top', '2px solid #555');
                    jumbo.css('background', '#111');
                } else {
                    middleCont.removeAttr('style');
                    playerSect.removeAttr('style');
                    allyNames.removeAttr('style');
                    enemyNames.removeAttr('style');
                    divider.removeAttr('style');
                    jumbo.removeAttr('style');
                }
            });
        });
    });

    //voice recognition reinitialise
    $(document).ready(function () {
        $scope.$apply(function () {
            $('.option-block-settings-1').click(function () {
                var scope = angular.element(document.getElementById("rightWrap")).scope();
                var getUserMediaResponse;
                if (scope.noMic) {
                    getUserMediaResponse = new SpeechSynthesisUtterance('Microphone permission denied. Click on the right most notification in your URL bar to enable your microphone.');
                    scope.timerWarning(getUserMediaResponse);
                    $('.mic-help').fadeIn()
                } else {
                    getUserMediaResponse = new SpeechSynthesisUtterance('Microphone connected');
                    scope.timerWarning(getUserMediaResponse);
                }
            });
        });
    });
    //voice assist toggle
    $(document).ready(function () {
        var popOut = $('.voice-assist-settings');
        $('.header-block.settings').click(function () {
            if (popOut.css('display') == 'block') popOut.fadeOut();
        });
        $('.middle-container').click(function () {
            if (popOut.css('display') == 'block') popOut.fadeOut();
        });
        $('.opt-settings').click(function () {
            if (popOut.css('display') == 'none' && $(this).attr('class') == 'option-block-settings-2 opt opt-settings') popOut.fadeIn(); else popOut.fadeOut();
        });
    });
    //language popup
    $(document).ready(function () {
        var popOut = $('.language-settings');
        $('.header-block.settings').click(function () {
            if (popOut.css('display') == 'block') popOut.fadeOut();
        });
        $('.middle-container').click(function () {
            if (popOut.css('display') == 'block') popOut.fadeOut();
        });
        $('.opt-settings').click(function () {
            if (popOut.css('display') == 'none' && $(this).attr('class') == 'option-block-settings-3 opt opt-settings') popOut.fadeIn(); else popOut.fadeOut();
        });
    });
    //cs-ticker settings
    $(document).ready(function () {
        var popOut = $('.cs-ticker-settings');
        $('.header-block.settings').click(function () {
            if (popOut.css('display') == 'block') popOut.fadeOut();
        });
        $('.middle-container').click(function () {
            if (popOut.css('display') == 'block') popOut.fadeOut();
        });
        $('.opt-settings').click(function () {
            if (popOut.css('display') == 'none' && $(this).attr('class') == 'option-block-settings-4 opt opt-settings') popOut.fadeIn(); else popOut.fadeOut();
        });
        $('.fa-angle-double-left').click(function () {
            popOut.find('.cs-ticker-input').val(function (i, val) {
                val = val.split('s');
                if (val[0] > 1) return parseInt(val) - 1 + 's';
                else return 1 + 's';
            });
            $('.cs-ticker-input').trigger('change');
        });
        $('.fa-angle-double-right').click(function () {
            popOut.find('.cs-ticker-input').val(function (i, val) {
                val = val.split('s');
                if (val[0] < 10) return parseInt(val) + 1 + 's';
                else return 10 + 's';
            });
            $('.cs-ticker-input').trigger('change');
        });
    });
    //tutorial popup
    $(document).ready(function () {
        $('.tutorial').click(function () {
            $('.tutorial-panel').removeClass('active');
            $('#2').addClass('active');
            $('#tutorial').modal('show');
        });
    });

    function isExtraEmpty() {
        return (!$('#slider8').prop('checked') && !$('#slider7').prop('checked') && !$('#slider6').prop('checked'));
    }

    $scope.checkIfExtra = function (sec) {
        if (sec == 'extras') return true;
    };
    $scope.checkIfVoice = function (sec) {
        if (sec == 'voice assist') return true;
    };

    $scope.chooseSection = function (sectionId) {
        $scope.findById(sectionId, function (section) {
            var c = '.option-instance.' + section.header;
            if ($(c).css('display') != 'block' && section.header != 'tutorial') {
                $(c).show('slow').promise().then($scope.recalcScroll);
            } else {
                $(c).hide('slow').promise().then($scope.recalcScroll);
            }
        });
    };
    //page-refresh
    $('.player-name').hover(function () {
        $('.refresh').fadeIn(30);
    }, function () {
        $('.refresh').fadeOut(30);
    });
    $('.player-name').click(function () {
        userVal(localStorage.getItem('player-name'), localStorage.getItem('player-region'));
    });

    $scope.playerRef = function () {
        var ref = $('.player-refactor');
        var alert = $('.alert');
        if ($(ref).css('display') != 'block') {
            $(ref).animate({width: 'toggle'}, 400);
        } else {
            $(ref).animate({width: 'toggle'}, 400);
            if ($(alert).css('display') == 'block') {
                $(alert).fadeOut('slow');
            }
        }
    };

    $scope.findById = function (id, callback) {
        var theSection = null;
        angular.forEach($scope.sections, function (section) {
            if (id == section.id) theSection = section

        });
        callback(theSection)
    };

    //tse-scroll-bar handler
    $scope.initiateScroll = function () {
        $('.scroll-wrap').TrackpadScrollEmulator();
    };
    $scope.recalcScroll = function () {
        $('.scroll-wrap').TrackpadScrollEmulator('recalculate');
    };
    $(window).resize(function () {
        $scope.recalcScroll();
    });
    $(document).ready(function () {
        $('.tse-scroll-content').scroll(function () {
            $('.voice-assist-settings').fadeOut();
            $('.language-settings').fadeOut();
            $('.cs-ticker-settings').fadeOut();
        })
    });
    //player call on 'search'
    $(document).ready(function () {
        $('.search').on('click', function () {
            playerName = $('.player-refactor input').val().toLowerCase();
            region = $('.player-refactor select').val().toLowerCase();
            localStorage.setItem('player-name', playerName);
            localStorage.setItem('player-region', region);
            userVal(playerName, region);
        });
    });
});

$(document).ready(function () {
    $('.timer-reminder input').change(function () {
        var str = $(this).val();
        var regStrStandard = /^(\d+):(\d+)$/;
        var regStrRaw = /^\d+$/;
        var strFinal;
        if (str.match(regStrStandard)) {
            var strSplit = str.split(':');
            if (strSplit.length == 2 && strSplit[1] < 61) {
                strFinal = (strSplit[0] * 60) + parseInt(strSplit[1]);
                $(this).val(strFinal);
            } else {
                reminderAlert();
                $(this).val('30');
            }
        } else if (str.match(regStrRaw) && str < 300) {
            strFinal = str;
            $(this).val(strFinal);
        } else {
            reminderAlert();
            $(this).val('30');
        }

    })
});
$(document).ready(function () {
    new Opentip($('.option-block-extras-5 a'), "Equip to show your ally team alongside your enemies on the dashboard.", {style: 'glass'});
    Opentip.lastZIndex = 9999;
    new Opentip($('.option-block-extras-6 a'), "Every time you hear the beat, take a quick glance at your minimap. You can set the time between ticks in the Settings tab to what you find most comfortable. As you get better, decrease the ticker interval to improve your awareness even more.", {style: 'glass'});
    Opentip.lastZIndex = 9999;
    new Opentip($('.option-block-extras-7 a'), "Manually set or adjust objective timers on this interactive map of Summoner's Rift.", {style: 'glass'});
    Opentip.lastZIndex = 9999;
    new Opentip($('.option-block-extras-8 a'), "The Cannon Wave notifier will signal every time a cannon wave leaves the base. Laners love their CS, and tend to get distracted when going for cannon minions. Use this to your advantage to plan stronger ganks or coordinate dives with your teammates.", {style: 'glass'});
    Opentip.lastZIndex = 9999;
});

function reminderAlert() {
    $('.alert-reminder').fadeIn();
    setTimeout(function () {
        $('.alert-reminder').fadeOut();
    }, 3000)
}

//settings-handler / cookie instance handler
$(document).ready(function () {
    var initVisit = localStorage.getItem("first-visit");
    if (initVisit === null) {
        $('#tutorial').modal('show');
        $('.mic-warning').fadeIn();
        localStorage.setItem("first-visit", false);
    }

    $('.voice-assist-volume').change(function () {
        localStorage.setItem('voice-assist-volume', $(this).val());
    });

    $('.cs-ticker-volume').change(function () {
        localStorage.setItem('cs-ticker-volume', $(this).val());
    });

    $('.cs-ticker-input').change(function () {
        localStorage.setItem('cs-ticker-input', $(this).val());
    });

    $('.voice-assist-reminder').change(function () {
        localStorage.setItem('voice-assist-reminder', $(this).val());
    });

    $('#slider5').change(function () {
        localStorage.setItem('slider5', $(this).prop('checked'));
    });

    $('#slider6').change(function () {
        localStorage.setItem('slider6', $(this).prop('checked'));
    });

    $('#slider7').change(function () {
        localStorage.setItem('slider7', $(this).prop('checked'));
    });

    $('#slider8').change(function () {
        localStorage.setItem('slider8', $(this).prop('checked'));
    });
    $('#slider9').change(function () {
        localStorage.setItem('slider9', $(this).prop('checked'));
    });


    if (localStorage.getItem("voice-assist-volume") != "null" && localStorage.getItem("voice-assist-volume") != null) {
        var setting1 = localStorage.getItem("voice-assist-volume");
        $('.voice-assist-volume').val(setting1);
    }
    if (localStorage.getItem("cs-ticker-volume") != "null" && localStorage.getItem("cs-ticker-volume") != null) {
        var setting2 = localStorage.getItem("cs-ticker-volume");
        $('.cs-ticker-volume').val(setting2);
    }
    if (localStorage.getItem("cs-ticker-input") != "null" && localStorage.getItem("cs-ticker-input") != null) {
        var setting3 = localStorage.getItem("cs-ticker-input");
        $('.cs-ticker-input').val(setting3);

    }
    if (localStorage.getItem("voice-assist-reminder") != "null" && localStorage.getItem("voice-assist-reminder") != null) {
        var setting4 = localStorage.getItem("voice-assist-reminder");
        $('.voice-assist-reminder').val(setting4);
    }
    if (localStorage.getItem("slider5") != "null" && localStorage.getItem("slider5") != null) {
        var setting5 = localStorage.getItem("slider5");
        setting5 = (setting5 == 'true');
        $('#slider5').prop('checked', setting5);
        $('#slider5').trigger('change');
    }
    if (localStorage.getItem("slider6") != "null" && localStorage.getItem("slider6") != null) {
        var setting6 = localStorage.getItem("slider6");
        setting6 = (setting6 == 'true');
        $('#slider6').prop('checked', setting6);
        $('#slider6').trigger('change');
    }
    if (localStorage.getItem("slider7") != "null" && localStorage.getItem("slider7") != null) {
        var setting7 = localStorage.getItem("slider7");
        setting7 = (setting7 == 'true');
        $('#slider7').prop('checked', setting7);
        $('#slider7').trigger('change');
    }
    if (localStorage.getItem("slider8") != "null" && localStorage.getItem("slider8") != null) {
        var setting8 = localStorage.getItem("slider8");
        setting8 = (setting8 == 'true');
        $('#slider8').prop('checked', setting8);
        $('#slider8').trigger('change');
    }
    if (localStorage.getItem("slider9") != "null" && localStorage.getItem("slider9") != null) {
        var setting9 = localStorage.getItem("slider9");
        setting9 = (setting9 == 'true');
        $('#slider9').prop('checked', setting9);
        $('#slider9').trigger('change');
    }
    setTimeout(function () {
        $('#slider9').trigger('change');
        $('#slider8').trigger('change');
        $('#slider7').trigger('change');
        $('#slider6').trigger('change');
        $('#slider5').trigger('change');
    }, 1)

});
//voice-commands modal viewer
$(document).ready(function () {
    $('.commands').click(function () {
        $('.voice-commands').modal('show');
    });
    var comTip = $('.command-tip');
    comTip.hover(function () {
        $(this).toggleClass('fa-volume-up');
    });
    comTip.click(function () {
        var tip = $(this).next().text();
        var msg = new SpeechSynthesisUtterance(tip);
        msg.voice = speechSynthesis.getVoices().filter(function (voice) {
            return voice.voiceURI == 'Google US English';
        })[0];
        msg.lang = 'en-US';
        msg.volume = 50;
        msg.rate = 1;
        speechSynthesis.speak(msg)
    });
    var html = '<img src="../images/index/summoner-number.png">';
    new Opentip($('.strong-green-sn'), html, {style: 'dark'});
});

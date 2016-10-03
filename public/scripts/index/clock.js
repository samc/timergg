$('head').append('<link rel="stylesheet" href="stylesheets/styleIndex.css" type="text/css" />');

var startTime = new Date(),
// get the starting positions of each hand (in seconds)
    startS = startTime.getSeconds(),
    startM = startTime.getMinutes() * 60 + startS,
    startH = startTime.getHours() % 12 * 3600 + startM;

refreshClock();

// compute the rotation amount relative to the starting time
function refreshClock() {
    var now = new Date(),
        diff = timeDifference(startTime, now),
        degS = (startS + diff) / 60 * 360,
        degM = (startM + diff) / 3600 * 360,
        degH = (startH + diff) / 43200 * 360;

    $('.hour').css(rotate(degH));
    $('.minute').css(rotate(degM));
    $('.second').css(rotate(degS));

    setTimeout(refreshClock, 1000);
}

// compute the time difference between two date objects (in seconds)
function timeDifference(date1, date2) {
    return Math.round(Math.abs(date2.getTime() - date1.getTime()) / 1000);
}

// returns the cross-browser css rotation properties
function rotate(deg) {
    return {
        '-webkit-transform': 'rotate(' + deg + 'deg)',
        '-moz-transform': 'rotate(' + deg + 'deg)',
        '-ms-transform': 'rotate(' + deg + 'deg)',
        '-o-transform': 'rotate(' + deg + 'deg)',
        'transform': 'rotate(' + deg + 'deg)'
    };
}

$(window).resize(function () {
    if ($(window).width() < 1200) {
        $('[href^="~"]').css("display", "none");
    } else {
        $('[href^="~"]').css("display", "block");
    }
    if ($(window).width() < 700) {
        $('[href^="="]').css("display", "none");
    } else {
        $('[href^="="]').css("display", "block");
    }
});
$(window).load(function () {
    if ($(window).width() < 1200) {
        $('[href^="~"]').css("display", "none");
    } else {
        $('[href^="~"]').css("display", "block");
    }
    if ($(window).width() < 700) {
        $('[href^="="]').css("display", "none");
    } else {
        $('[href^="="]').css("display", "block");
    }
});



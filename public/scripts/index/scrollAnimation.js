// Hide Header on on scroll down
var didScroll;
var lastScrollTop = 0;
var delta = 5;
var navbarHeight = $('nav').outerHeight();

$(window).scroll(function(){
    didScroll = true;
});

setInterval(function() {
    if (didScroll) {
        hasScrolled();
        didScroll = false;
    }
}, 250);

function hasScrolled() {
    var st = $(this).scrollTop();

    // Make sure they scroll more than delta
    if (Math.abs(lastScrollTop - st) <= delta)
        return;

    // If they scrolled down and are past the navbar, add class .nav-up.
    // This is necessary so you never see what is "behind" the navbar.
    if (st > lastScrollTop && st > navbarHeight) {
        // Scroll Down
        $('nav').removeClass('nav-down').addClass('nav-up');
    } else {
        // Scroll Up
        if (st + $(window).height() < $(document).height() && $('.slide-in').length == 0) {
            $('nav').removeClass('nav-up').addClass('nav-down');
        }
    }

    lastScrollTop = st;
}
$(document).ready(function(){
    $('a[id^="#"]').on('click', function (e) {
        e.preventDefault();

        var target = $(this).attr('id');
        var $target = $(target);

        $('html, body').stop().animate({
            'scrollTop': $target.offset().top
        }, 900, 'swing', function () {
            window.location.hash = target;
        });
    });
});
//player call on 'search'
$(document).ready(function() {
    $('#summoner-input').submit('click', function (e) {
        e.preventDefault();
        playerName = $('.summonerInput input').val().toLowerCase();
        region = $('input:radio[name=region]:checked').val().toLowerCase();
        localStorage.setItem('player-name', playerName);
        localStorage.setItem('player-region', region);
        userVal(playerName, region);
    });
});
//player call on 'ENTER'
$(document).keypress(function(e){
    if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
        document.forms[0].submit();
        return false;
    } else {
        return true;
    }
});

$(window).resize(function () {
    if ($(window).width() <= 750) {
        $('.categories').css("display", "block");
    } else {
        $('.categories').css("display", "none");
    }
});

$(window).load(function () {
    if ($(window).width() <= 750) {
        $('.categories').css("display", "block");
    } else {
        $('.categories').css("display", "none");
    }
});

jQuery(document).ready(function ($) {

    var MqM = 768;

    var faqTrigger = $('.trigger'),
        faqsContainer = $('.faq-items'),
        faqsCategoriesContainer = $('.categories'),
        faqsCategories = faqsCategoriesContainer.find('a'),
        closeFaqsContainer = $('.cd-close-panel');

    //select a faq section
    faqsCategories.on('click', function (event) {
        event.preventDefault();
        var selectedHref = $(this).attr('href'),
            target = $(selectedHref);
        if ($(window).width() < MqM) {
            faqsContainer.scrollTop(0).addClass('slide-in').children('ul').removeClass('selected').end().children(selectedHref).addClass('selected');
            closeFaqsContainer.addClass('move-left');
            $('body').addClass('cd-overlay');
        } else {
            $('body,html').animate({'scrollTop': target.offset().top - 19}, 200);
        }
    });

    //close faq lateral panel - mobile only
    $('body').bind('click touchstart', function (event) {
        if ($(event.target).is('body.cd-overlay') || $(event.target).is('.cd-close-panel')) {
            closePanel(event);
        }
    });
    faqsContainer.on('swiperight', function (event) {
        closePanel(event);
    });


    faqTrigger.on('click', function (event) {
        event.preventDefault();
        $(this).next('.faq-content').slideToggle(200).end().parent('li').toggleClass('content-visible');
    });


    function closePanel(e) {
        e.preventDefault();
        faqsContainer.removeClass('slide-in').find('li').show();
        closeFaqsContainer.removeClass('move-left');
        $('body').removeClass('cd-overlay');
    }

});

$(document).ready(function () {
    var alert = $('.alert');
    var alertCont = $('.alert-cont');
    var url = window.location.href;
    var urlPop = url.split('/').pop();
    var savedReg = localStorage.getItem('player-region');
    savedReg = savedReg.toUpperCase();
    $('#' + savedReg).prop('checked', true);
    if (urlPop.indexOf('#error') !== -1) {
        alert.fadeIn('slow');
        $('.nav-down').css('animation', 'none');
        $('.logo').css('animation', 'none');
        $('.centerHeader').css('animation', 'none');
        $('.subHeader').css('animation', 'none');
    }
    if (urlPop == '#error') {
        alertCont.text("The player name you entered does not exist.");
    }
    else if (urlPop == '#error1') {
        alertCont.text("The player name you entered does not exist.");
    }
    else if (urlPop == '#error2') {
        alertCont.text("Active game not found, make sure summoner is in active game.");
    }
    else if (urlPop == '#error3') {
        alertCont.text("Make sure you're in a normal or ranked game type.");
    }
    else if (urlPop == '#error4') {
        alertCont.text("There was an issue grabbing data from Riot, try again shortly.");
    }
    else if (urlPop == '#error5') {
        alertCont.text("Looks like what you were looking for doesn't exist.");
    }
    else if (urlPop == '#error6') {
        alertCont.text("You tried to connect to many times, try again shortly");
    }
});



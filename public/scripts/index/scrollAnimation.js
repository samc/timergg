// Hide Header on on scroll down
var socket = io.connect();
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
        if (st + $(window).height() < $(document).height()) {
            $('nav').removeClass('nav-up').addClass('nav-down');
        }
    }

    lastScrollTop = st;
}
$(document).ready(function(){
    $('a[href^="#"]').on('click',function (e) {
        e.preventDefault();

        var target = this.hash;
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
    $('.button').on('click', function(){
        playerName = $('.summonerInput input').val().toLowerCase();
        region = $('input:radio[name=region]:checked').val().toLowerCase();
        userVal(playerName, region);
    });
});
//player call on 'ENTER'
$(document).keypress(function(e){
    if (e.which == 13){
        e.preventDefault();
        playerName = $('.summonerInput input').val().toLocaleLowerCase();
        region = $('input:radio[name=region]:checked').val().toLowerCase();
        userVal(playerName, region);
    }
});

$(window).load(function(){
    var url = window.location.href;
    if(url.split('/').pop() == '#error') $('.alert').css('visibility', 'visible');
});

/*socket.on('playerCallBoolean', function(data){
    playerName = $('.summonerInput input').val().toLocaleLowerCase();
    region = $('input:radio[name=region]:checked').val().toLowerCase();
    if (data){
        var p = data[playerName].name;
        window.location.href = "/dashboard/playerName=" + p.split(' ').join('+') + '/' + region;
    } else {
        $('.alert').css('visibility', 'visible');
    }
});*/
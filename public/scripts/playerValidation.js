var playerName = '';
var region = '';

function isAdequateLength(input) {
    var length = input.length;
    return (2 < length < 17);
}

function checkInputIsAlphaNumeric(input) {
    var alphanumerics = /[!@#$^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    return (input.match(alphanumerics));
}

var userVal = function (pl, rg) {
    if (checkInputIsAlphaNumeric(pl) === null && checkInputIsAlphaNumeric(rg) === null && isAdequateLength(pl)) window.location.href = "/dashboard/playerName=" + pl.split(' ').join('+') + '/' + rg; else {
        $('.alert').fadeIn('slow');
    }
};

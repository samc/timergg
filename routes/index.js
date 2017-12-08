var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'] === "http") {
        res.redirect("https://" + req.headers.host + req.url);
    }
    res.render('index', {

        title: 'TIMER.GG',
        err: false

    });
});

module.exports = router;
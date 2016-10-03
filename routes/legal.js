var express = require('express');
var router = express.Router();

/* GET legal */
router.get('/', function (req, res, next) {
    res.render('legal', {

        title: 'TIMER.GG',

    });
});

module.exports = router;

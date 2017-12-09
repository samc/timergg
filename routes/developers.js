var express = require('express');
var router = express.Router();

/* GET legal */
router.get('/', function (req, res) {
    res.render('developers', {

        title: 'TIMER.GG'

    });
});

module.exports = router;
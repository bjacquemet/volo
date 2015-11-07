var express = require('express');
var router = express.Router();
var NonprofitController = require('../controllers/nonprofit');

function ensureAuthenticated(req, res, next) {
    if (req.user) {
        return next();
    }
    res.sendStatus(401);
}

// Get the whole list of nonprofits (used on editprofile page) as JSON
// No params
router.get("/list", ensureAuthenticated, NonprofitController.list);

// Create a new nonprofit and send back a status
// Params: 
// - name (String)
// - suggested_by_volunteer (boolean)
// - created_by (_id of volunteer)
router.post("/new", ensureAuthenticated, NonprofitController.new);

router.get("/habitat_for_humanity", function (req, res, next) {
    res.header('Cache-Control', 'public, max-age=2629740, no-cache');
    res.render('nonprofit/habitat', {title: 'Habitat for Humanity', user: req.user});
});

router.get("/mosaic", function (req, res, next) {
    res.header('Cache-Control', 'public, max-age=2629740, no-cache');
    res.render('nonprofit/mosaic', {title: 'Mosaic', user: req.user});
});

router.get("/ageuk_eastlondon", function (req, res, next) {
    res.header('Cache-Control', 'public, max-age=2629740, no-cache');
    res.render('nonprofit/ageuk_eastlondon', {title: 'Age UK', user: req.user});
});

router.get("/challenge_africa", function (req, res, next) {
    res.header('Cache-Control', 'public, max-age=2629740, no-cache');
    res.render('nonprofit/challenge_africa', {title: 'Challenge Africa', user: req.user});
});


module.exports = router;

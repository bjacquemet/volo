var express = require('express');
var router = express.Router();
var Skill = require('../models/skill');
var SkillController = require('../controllers/skill');

function ensureAuthenticated(req, res, next) {
    if (req.user) {
        return next();
    }
    res.sendStatus(401);
}

function ensureAdmin(req, res, next) {
    if (req.user && req.user.usertype.indexOf('admin') > 0) {
        return next();
    }
    res.sendStatus(401);
}

// Render the add new skill page reserved to admin
router.get("/add_new_skill", ensureAdmin, function (req, res) {
    res.render('skill/addNewSkill', {title: 'Add a new skill', user: req.user})
});

// Get the whole list of skills (used on editprofile page) as JSON
// No params
router.get("/list", ensureAuthenticated, SkillController.list);

// Create a new skill (admin only) and send back a status
// Params: 
// - name (String)
// - suggested_by_volunteer (boolean)
// - created_by (_id of volunteer)
router.post("/new", ensureAdmin, SkillController.new);

// Create a new skill request and send an email to melissa@volo.org.uk
// Params: 
// - name (String)
// - suggested_by_volunteer (boolean)
// - created_by (_id of volunteer)
router.post("/new_request", ensureAuthenticated, SkillController.newRequest)

module.exports = router;

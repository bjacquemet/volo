var express = require('express');
var router = express.Router();
var Skill = require('../models/skill');
var SkillController = require('../controllers/skill');

function ensureAuthenticated(req, res, next) {
  if (req.user) { return next(); }
  res.sendStatus(401);
}

// Get the whole list of skills (used on editprofile page) as JSON
// No params
router.get("/list", ensureAuthenticated ,SkillController.list);

// Create a new skill and send back a status
// Params: 
// - name (String)
// - suggested_by_volunteer (boolean)
// - created_by (_id of volunteer)
router.post("/new", ensureAuthenticated, SkillController.new);

module.exports = router;

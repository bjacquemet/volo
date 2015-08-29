var express = require('express');
var router = express.Router();
var Skill = require('../models/skill');
var SkillController = require('../controllers/skill');

function ensureAuthenticated(req, res, next) {
  if (req.user) { return next(); }
  res.sendStatus(401);
}

router.get("/list", ensureAuthenticated ,SkillController.list);

router.post("/new", ensureAuthenticated, SkillController.new);

module.exports = router;

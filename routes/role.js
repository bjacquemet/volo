var express = require('express');
var router = express.Router();
var Role = require('../models/role');
var RoleController = require('../controllers/role');

function ensureAuthenticated(req, res, next) {
  if (req.user) { return next(); }
  res.sendStatus(401);
}

router.get("/list", ensureAuthenticated, RoleController.list);

router.post("/new", ensureAuthenticated, RoleController.new);

module.exports = router;

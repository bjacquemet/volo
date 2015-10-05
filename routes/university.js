var express = require('express');
var router = express.Router();
var TrackingController = require('../controllers/tracking');
var UniversityController = require('../controllers/university');

function ensureAdmin(req, res, next) {
  if (req.user && req.user.usertype.indexOf('admin') > 0) { return next(); }
  res.sendStatus(401);
}

function ensureAuthenticated(req, res, next) {
  if (req.user) { return next(); }
  res.sendStatus(401);
}

router.post("/new", UniversityController.new);

router.get("/list", UniversityController.list);

router.post('/newRight', ensureAdmin, TrackingController.new);

// must be the last one in order to not overwrite the other ones
router.get('/:university', TrackingController.all);

module.exports = router;
var express = require('express');
var router = express.Router();
var ActivityController = require('../controllers/activity');

function ensureAuthenticated(req, res, next) {
  if (req.user) { return next(); }
  res.sendStatus(401);
}

function ensureAdmin(req, res, next) {
  if (req.user && req.user.usertype.indexOf('admin') > 0) { return next(); }
  res.sendStatus(401);
}

router.get("/list", ActivityController.list);

router.get("/volunteer/:id", ActivityController.getByVolunteerId);

router.get("/skills/:id", ActivityController.getVolunteerSkills);

router.get("/get/:id", ActivityController.get)

router.post("/new", ensureAuthenticated, ActivityController.new);

router.get('/validation', ActivityController.ActivityToBeValidatedByRefereeEmail)

router.get('/all_pending', ActivityController.allPending)

router.post("/accept", ActivityController.accept);

router.post("/decline", ActivityController.decline);

router.get("/admin/list", ensureAdmin, ActivityController.listActivitiesForAdmin);

router.get("/admin/validation", ensureAdmin, ActivityController.validateActivitiesByAdmin);

module.exports = router;

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

// router.get("/list", ActivityController.list);

// router.get("/volunteer/:id", ActivityController.getByVolunteerId);

// router.get("/skills/:id", ActivityController.getVolunteerSkills);

// Get one activity details
// param: _id (id of an activity)
// sending back a json
router.get("/get/:id", ensureAuthenticated, ActivityController.get)

// Create new activity
router.post("/new", ensureAuthenticated, ActivityController.new);

// Validation page for referees
router.get('/validation', ActivityController.ActivityToBeValidatedByRefereeEmail)

// Get total accepted hours for authenticated user
router.get('/totalHours', ensureAuthenticated, ActivityController.getTotalHours)

// Get weekly hours for the authenticated user
router.get('/weeklyHours', ensureAuthenticated, ActivityController.getWeeklyHours)

// router.get('/all_pending', ActivityController.allPending)

// Accept one activity (for referee or admin)
router.post("/accept", ActivityController.accept);

// Decline one activity
router.post("/decline", ActivityController.decline);

// Update one activity (if pending)
router.post("/update", ensureAuthenticated, ActivityController.update);

// Update notes on one activity
router.post("/update_notes", ensureAuthenticated, ActivityController.update_notes);

// Get list of activities (Admin only)
router.get("/admin/list", ensureAdmin, ActivityController.listActivitiesForAdmin);

// Validation page for Admin
router.get("/admin/validation", ensureAdmin, ActivityController.validateActivitiesByAdmin);

module.exports = router;

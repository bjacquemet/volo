var express = require('express');
var router = express.Router();
var ActivityController = require('../controllers/activity');

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

// Get one activity details via JSON
// Param: _id (id of an activity)
router.get("/get/:id", ensureAuthenticated, ActivityController.get)

// Create a new activity and send back a status
// Params: 
// - experience (_id of experience - parent)
// - volunteer (_id of volunteer)
// - role (_id of the role)
// - skills (array of skills _id)
// - hours (number of hours)
// - s_date (date start)
// - e_date (date end) - optional
// - referee_name (string)
// - referee_email (string)
// - referee_phone (string)
router.post("/new", ensureAuthenticated, ActivityController.new);

// Render Validation page for one defined referee
// Params: 
// - email (string - email of the referee)
// - token (token associated with referee)
router.get('/validation', ActivityController.ActivityToBeValidatedByRefereeEmail)

// Get total accepted hours for the authenticated user via JSON
// No param
router.get('/totalHours', ensureAuthenticated, ActivityController.getTotalHours)

// Get weekly hours for the authenticated user via JSON
// No params
router.get('/weeklyHours', ensureAuthenticated, ActivityController.getWeeklyHours)

// Accept one activity (for referee or admin) and send back a status
// Params:
// - activityId (_id of activity)
// - recommendation (string) - option
router.post("/accept", ActivityController.accept);

// Decline one activity and send back a status
// Params:
// - activityId (_id of activity)
// - declineReason (string)
router.post("/decline", ActivityController.decline);

// Update one activity (if pending) and send back a status
// Params:
// - activity (_id of the activity to update)
// - role (_id of the role)
// - skills (array of skills _id)
// - hours (number of hours)
// - s_date (date start)
// - e_date (date end) - optional
// - notes (string) - optional
router.post("/update", ensureAuthenticated, ActivityController.update);

// Update notes on one activity and send back a status
// Params:
// - activity (_id of the activity to update)
// - notes (string) - optional
router.post("/update_notes", ensureAuthenticated, ActivityController.update_notes);

// Get list of activities (Admin only) and render list page
router.get("/admin/list", ensureAdmin, ActivityController.listActivitiesForAdmin);

// Validation page for Admin and render admin validation page
router.get("/admin/validation", ensureAdmin, ActivityController.validateActivitiesByAdmin);

module.exports = router;

// ARCHIVES
// router.get("/list", ActivityController.list);
// router.get("/volunteer/:id", ActivityController.getByVolunteerId);
// router.get("/skills/:id", ActivityController.getVolunteerSkills);
// router.get('/all_pending', ActivityController.allPending)

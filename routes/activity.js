var express = require('express');
var router = express.Router();
var ActivityController = require('../controllers/activity');
var TrackingController = require('../controllers/tracking');

router.get("/list", ActivityController.list);

router.get("/volunteer/:id", ActivityController.getByVolunteerId);

router.get("/skills/:id", ActivityController.getVolunteerSkills);

router.post("/new", ActivityController.new);

router.get('/validation', ActivityController.ActivityToBeValidatedByRefereeEmail)

router.get('/all_pending', ActivityController.allPending)

router.post("/accept", ActivityController.accept);

router.post("/decline", ActivityController.decline);

router.get('/university/:university', TrackingController.perMonth);

module.exports = router;

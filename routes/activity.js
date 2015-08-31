var express = require('express');
var router = express.Router();
var ActivityController = require('../controllers/activity');


router.get("/list", ActivityController.list);

router.get("/volunteer/:id", ActivityController.getByVolunteerId);

router.get("/skills/:id", ActivityController.getVolunteerSkills);

router.post("/new", ActivityController.new);

module.exports = router;

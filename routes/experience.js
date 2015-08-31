var express = require('express');
var router = express.Router();
var ExperienceController = require('../controllers/experience');

router.get("/list", ExperienceController.list);

router.get("/volunteer/:id", ExperienceController.getByVolunteerIdParam);

router.post("/new", ExperienceController.new);

module.exports = router;

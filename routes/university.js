var express = require('express');
var router = express.Router();
var TrackingController = require('../controllers/tracking');
var UniversityController = require('../controllers/university');

router.post("/new", UniversityController.new);

router.get("/list", UniversityController.list);

// must be the last one in the route order
router.get('/:university', TrackingController.all);

module.exports = router;
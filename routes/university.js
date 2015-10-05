var express = require('express');
var router = express.Router();
var TrackingController = require('../controllers/tracking');
var UniversityController = require('../controllers/university');

router.post("/new", UniversityController.new);

router.get("/list", UniversityController.list);

// must be the last one in order to not overwrite the other ones
router.get('/:university', TrackingController.all);
router.post('/newRight', TrackingController.new);

module.exports = router;
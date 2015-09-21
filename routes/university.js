var express = require('express');
var router = express.Router();
var TrackingController = require('../controllers/tracking');

router.get('/:university', TrackingController.all);

module.exports = router;
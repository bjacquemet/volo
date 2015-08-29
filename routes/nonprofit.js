var express = require('express');
var router = express.Router();
var NonprofitController = require('../controllers/nonprofit');

router.get("/list", NonprofitController.list);

router.post("/new", NonprofitController.new);

module.exports = router;

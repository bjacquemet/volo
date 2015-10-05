var express = require('express');
var router = express.Router();
var NonprofitController = require('../controllers/nonprofit');

function ensureAuthenticated(req, res, next) {
  if (req.user) { return next(); }
  res.sendStatus(401);
}

// Get the whole list of nonprofits (used on editprofile page) as JSON
// No params
router.get("/list", ensureAuthenticated, NonprofitController.list);

// Create a new nonprofit and send back a status
// Params: 
// - name (String)
// - suggested_by_volunteer (boolean)
// - created_by (_id of volunteer)
router.post("/new", ensureAuthenticated, NonprofitController.new);

module.exports = router;

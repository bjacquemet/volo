var express = require('express');
var router = express.Router();
var Role = require('../models/role');
var RoleController = require('../controllers/role');

function ensureAuthenticated(req, res, next) {
    if (req.user) {
        return next();
    }
    res.sendStatus(401);
}

// Get the whole list of roles (used on editprofile page) as JSON
// No params
router.get("/list", ensureAuthenticated, RoleController.list);

// Create a new role and send back a status
// Params: 
// - name (String)
// - suggested_by_volunteer (boolean)
// - created_by (_id of volunteer)
router.post("/new", ensureAuthenticated, RoleController.new);

module.exports = router;

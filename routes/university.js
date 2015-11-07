var express = require('express');
var router = express.Router();
var TrackingController = require('../controllers/tracking');
var UniversityController = require('../controllers/university');

function ensureAdmin(req, res, next) {
    if (req.user && req.user.usertype.indexOf('admin') > 0) {
        return next();
    }
    res.sendStatus(401);
}

function ensureAuthenticated(req, res, next) {
    if (req.user) {
        return next();
    }
    res.sendStatus(401);
}

// Get the whole list of universities (used on editprofile page) as JSON
// No params
router.post("/new", UniversityController.new);

// Create a new university and send back a status
// Params: 
// - name (String)
// - suggested_by_volunteer (boolean)
// - created_by (_id of volunteer)
router.get("/list", UniversityController.list);

// Create a new right for a specific university (used for checking user rights on tracking page)
// Only people with the right "usertype" can access tracking page of a university
// Create a new right and send back a status
// Params:
// - university: (_id)
// - right (String - same String as the one the volunteer will have to have in usertype)
router.post('/newRight', ensureAdmin, TrackingController.newRight);

// must be the last one in order to not overwrite the other ones
// Get tracking for one university and render student tracking page
// Param:
// university: String (name)
router.get('/:university', TrackingController.all);

module.exports = router;
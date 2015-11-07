var express = require('express');
var router = express.Router();
var ExperienceController = require('../controllers/experience');

function ensureAuthenticated(req, res, next) {
    if (req.user) {
        return next();
    }
    res.sendStatus(401);
}

// router.get("/list", ensureAuthenticated, ExperienceController.list);

// router.get("/volunteer/:id", ExperienceController.getByVolunteerIdParam);

// Create a new experience for a user and send back a status
// Params: 
// - nonprofit (_id of nonprofit)
// - volunteer (_id of volunteer)
// - description (string) - optional
// - role (_id of the role)
// - skills (array of skills _id)
// - hours (number of hours)
// - s_date (date start)
// - e_date (date end) - optional
// - referee_name (string)
// - referee_email (string)
// - referee_phone (string)
router.post("/new", ensureAuthenticated, ExperienceController.new);

// Update an experience description and send back a status
// Params:
// - name: field name (description)
// - value: String (new value)
// - pk: experience _id to modify
router.post("/update", ensureAuthenticated, ExperienceController.update);


// Get the volunteers for a nonprofit in JSON
// Param:
// - id: nonprofit _id
router.get("/volunteersByNonprofit/:id", ExperienceController.getByNonprofitId);

module.exports = router;

var express = require('express');
var router = express.Router();
var VolunteerController = require('../controllers/volunteer');


function ensureAuthenticated(req, res, next) {
    if (req.user) {
        return next();
    }
    res.redirect('../login')
}

// router.get('/photo/:id', VolunteerController.getPhotoByVolunteerId);

// Add a new photo, associate it with a volunteer and send back a status
// Params:
// File (image)
router.post('/photo', VolunteerController.postPhoto);

// Render private profile of a authenticated volunteer
// No params (but needs authenticated user)
router.get('/edit', ensureAuthenticated, VolunteerController.getEditProfile);

// Update authenticated user profile and send back status
// This method works with X-Editable library (on the frontend) and enable update 
// of the different fields of the volunteer profile
// Params:
// - name: field name. Only the following fields are allowed:
// - first_name
// - last_name
// - gender
// - birthdate
// - email
// - phone
// - position
// - country
// - city
// - about
// - university
// - area_of_study
// - degree
// - company
// - graduation_year
// - graduate
// - value: String (new value)
// - pk: experience _id to modify
router.post('/update', ensureAuthenticated, VolunteerController.updateProfile);

// Get a list of 16 random volunteer profile, sent as a JSON
// No params
router.get('/list', VolunteerController.list);

// Search for volunteer profile and render the search result page
// Param:
// search (String -> must be longer that 3 characters)
router.get('/search', VolunteerController.searchProfile);

// Render public profile of a specific volunteer
// Params
// id (volunteer _id)
// need to be the last one in order to not overwrite all the ones before.
router.get('/:id', VolunteerController.getProfile);

module.exports = router;

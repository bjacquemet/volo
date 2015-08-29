var express = require('express');
var router = express.Router();
var VolunteerController = require('../controllers/volunteer');


function ensureAuthenticated(req, res, next) {
  if (req.user) { return next(); }
  res.redirect('../login')
}

router.get("/photo/:email", VolunteerController.getPhotoByVolunteerEmail);

router.post('/photo', VolunteerController.postPhoto);

router.get('/edit', ensureAuthenticated, VolunteerController.getEditProfile);

router.post('/new', ensureAuthenticated, VolunteerController.newProfile);

router.post('/update', ensureAuthenticated, VolunteerController.editProfile);

module.exports = router;

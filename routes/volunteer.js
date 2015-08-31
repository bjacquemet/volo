var express = require('express');
var router = express.Router();
var VolunteerController = require('../controllers/volunteer');


function ensureAuthenticated(req, res, next) {
  if (req.user) { return next(); }
  res.redirect('../login')
}

router.get('/photo/:id', VolunteerController.getPhotoByVolunteerId);

router.post('/photo', VolunteerController.postPhoto);

router.get('/edit', ensureAuthenticated, VolunteerController.getEditProfile);

router.post('/new', ensureAuthenticated, VolunteerController.newProfile);

router.post('/update', ensureAuthenticated, VolunteerController.updateProfile);

router.get('/list', VolunteerController.list);

// need to be the last one in order to not overwrite all the ones before.
router.get('/:id', VolunteerController.getProfile);

module.exports = router;

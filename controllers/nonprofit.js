var Nonprofit = require('../models/nonprofit');

exports.list = function(req,res) {
    Nonprofit.find({}).select('_id name suggested_by_volunteer').exec(function(err,nonprofits) {
      console.log(nonprofits);
      nonprofits.push({ _id: 0,
                        name: 'Other'});
      res.send(nonprofits);
    });
};

// todo: add a created_by = volunteer._id
exports.new =function(req,res) {
  if (!req.body.name || !req.body.suggested_by_volunteer) {
    res.send(400);
  }
  var name = req.body.name;
  var sbv = req.body.suggested_by_volunteer;
  var newNonprofit = Nonprofit(
  {
    name: name, 
    suggested_by_volunteer: sbv
  });
  newNonprofit.save(function (err) {
    if (err) res.sendStatus(400);
    else res.sendStatus(201);  
  })
};

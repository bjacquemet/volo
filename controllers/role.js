var Role = require('../models/role');

exports.list = function(req,res) {
    Role.find({}).select('_id name').exec(function(err,roles) {
      res.send(roles);
    });
};

// todo: add a created_by = volunteer._id
exports.new = function(req,res) {
  var name = req.body.name;
  if (Object.prototype.toString.call(name) === '[object Array]')
  {
    var name_is_array = true;
    name = name[0];
  }
  var newRole = Role(
  {
    name: name
  });
  newRole.save(function (err) {
    if (err) throw err;
    else {
      if (name_is_array)
      {
        res.status(201).send('Only ' + name + ' has been created. Only one role can be set at a time');
      }
      else res.sendStatus(201);
    }
  })
};
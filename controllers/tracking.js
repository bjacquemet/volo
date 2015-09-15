var Activity = require('../models/activity');
var Volunteer = require('../models/volunteer');

function getStudentsOfUniversity (university, callback) {
  Volunteer.find({position: "student", university: university}, {select: '_id'}, function (err, students) {
    if (err) callback(err, null);
    else { 
      var s_array = [];
      students.forEach(function (student) {
        s_array.push(student._id);
      })
      console.log(s_array);
      callback(null, s_array);
    }
  })
}

function getHoursPerMonth (university, callback) {
  getStudentsOfUniversity(university, function (err, students) {
    Activity.aggregate(
    [{
      $match:
      {
        volunteer: {$in: students}
      }
    }
    ,
    {
      $group: {
        _id: "$volunteer",
        sum_hours: {$sum: "$hours"}
      }
    },
    {
      $sort: {
        sum_hours: -1
      }
    }
    ],
    function (err, activities) {
      if (err) callback(err, null);
      else {
        Volunteer.populate(activities, {path: '_id', select: 'first_name last_name'}, function (err, activities) {
          callback(null, activities);
        })
      }
    }
    )  
  })
}

exports.perMonth = function (req, res) {
  getHoursPerMonth(req.params.university, function (err, activities) {
    if (err) console.log(err);
    else res.send(activities);
  });
}



// "position" : "student",
//   "graduation_year" : 2016,
//   "graduate" : "undergraduate",
//   "discipline" : "Law School",
//   "university" : "City University",
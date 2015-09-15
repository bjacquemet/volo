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
      callback(null, s_array);
    }
  })
}

function getHoursPerMonth (university, callback) {
  getStudentsOfUniversity(university, function (err, students) {
    var start = new Date(2015, 1, 1);
    Activity.aggregate(
    [{
      $match:
      {
        volunteer: {$in: students},
        validated: 'accepted',
        start_date: {$gte: start}
      }
    }
    ,
    {
      $group: {
        _id: {volunteer: "$volunteer", month: {$month: "$start_date"}, year: {$year: "$start_date"}},
        sum_hours: {$sum: "$hours"}
      }
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1
      }
    }
    ],
    function (err, activities) {
      if (err) callback(err, null);
      else {
        Volunteer.populate(activities, {path: '_id.volunteer', select: 'first_name last_name'}, function (err, activities) {
          callback(null, activities);
        })
      }
    }
    )  
  })
}

function getHoursPerDiscipline (university, callback) {
  var start = new Date(1900, 1, 1);
  getStudentsOfUniversity(university, function (err, students) {
    // find disciplines and foreach discipline, list of students
    Volunteer.aggregate([
      {
        $match:
        {
          "_id": {$in: students}
        }
      },
      {
        $group: {
          _id: "$discipline",
          students: {$push: "$_id"}
        }
      }
      ], function (err, disciplines) {
        if (err) callback (err, null);
        var hours_per_discipline = [],
            discipline_length = disciplines.length,
            i = 1;
        // for each discipline and list of students
        // get activities per month
        disciplines.forEach(function (discipline) {
          Activity.aggregate(
          [{
            $match:
            {
              volunteer: {$in: discipline.students},
              validated: 'accepted',
              start_date: {$gte: start}
            }
          }
          ,
          {
            $group: {
              _id: {month: {$month: "$start_date"}, year: {$year: "$start_date"}},
              sum_hours: {$sum: "$hours"}
            }
          },
          {
            $sort: {
              "_id.year": 1,
              "_id.month": 1
            }
          }
          ],
          function (err, activities) {
            // aggregate sum_hours to list
            if (err) callback(err, null);
            else {
              var hours_for_a_discipline = {discipline: discipline._id, hours: activities};
              hours_per_discipline.push(hours_for_a_discipline);
              if (discipline_length == i) {
                callback(null, hours_per_discipline);
              }
              else i++;
            }
          })
        })
      })  
  })
}

function getHoursPerGraduationYear (university, callback) {
  var start = new Date(1900, 1, 1);
  getStudentsOfUniversity(university, function (err, students) {
    // find graduation_years and foreach graduation_year, list of students
    Volunteer.aggregate([
      {
        $match:
        {
          "_id": {$in: students}
        }
      },
      {
        $group: {
          _id: "$graduation_year",
          students: {$push: "$_id"}
        }
      }
      ], function (err, graduation_years) {
        if (err) callback (err, null);
        var hours_per_graduation_year = [],
            graduation_year_length = graduation_years.length,
            i = 1;
        // for each graduation_year and list of students
        // get activities per month
        graduation_years.forEach(function (graduation_year) {
          Activity.aggregate(
          [{
            $match:
            {
              volunteer: {$in: graduation_year.students},
              validated: 'accepted',
              start_date: {$gte: start}
            }
          }
          ,
          {
            $group: {
              _id: {month: {$month: "$start_date"}, year: {$year: "$start_date"}},
              sum_hours: {$sum: "$hours"}
            }
          },
          {
            $sort: {
              "_id.year": 1,
              "_id.month": 1
            }
          }
          ],
          function (err, activities) {
            // aggregate sum_hours to list
            if (err) callback(err, null);
            else {
              var hours_for_a_graduation_year = {graduation_year: graduation_year._id, hours: activities};
              hours_per_graduation_year.push(hours_for_a_graduation_year);
              if (graduation_year_length == i) {
                callback(null, hours_per_graduation_year);
              }
              else i++;
            }
          })
        })
      })  
  })
}

function getHoursPerGraduate (university, callback) {
  // undergraduate vs postgraduate
  var start = new Date(1900, 1, 1);
  getStudentsOfUniversity(university, function (err, students) {
    // find graduate type and foreach graduate type, list of students
    Volunteer.aggregate([
      {
        $match:
        {
          "_id": {$in: students}
        }
      },
      {
        $group: {
          _id: "$graduate",
          students: {$push: "$_id"}
        }
      }
      ], function (err, graduates) {
        if (err) callback (err, null);
        var hours_per_graduate = [],
            graduates_length = graduates.length,
            i = 1;
        // for each graduation_year and list of students
        // get activities per month
        graduates.forEach(function (graduate) {
          Activity.aggregate(
          [{
            $match:
            {
              volunteer: {$in: graduate.students},
              validated: 'accepted',
              start_date: {$gte: start}
            }
          }
          ,
          {
            $group: {
              _id: {month: {$month: "$start_date"}, year: {$year: "$start_date"}},
              sum_hours: {$sum: "$hours"}
            }
          },
          {
            $sort: {
              "_id.year": 1,
              "_id.month": 1
            }
          }
          ],
          function (err, activities) {
            // aggregate sum_hours to list
            if (err) callback(err, null);
            else {
              var hours_for_a_graduate = {graduate: graduate._id, hours: activities};
              hours_per_graduate.push(hours_for_a_graduate);
              if (graduates_length == i) {
                callback(null, hours_per_graduate);
              }
              else i++;
            }
          })
        })
      })  
  })
}

exports.perMonth = function (req, res) {
  getHoursPerGraduate(req.params.university, function (err, activities) {
    if (err) console.log(err);
    else res.send(activities);
  });
}



// "position" : "student",
//   "graduation_year" : 2016,
//   "graduate" : "undergraduate",
//   "discipline" : "Law School",
//   "university" : "City University",
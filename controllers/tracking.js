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
    },
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

exports.getHoursPerStudent = function (req, res) {
  getStudentsOfUniversity(req.params.university, function (err, students) {
    var start = new Date(2015, 1, 1);
    Activity.aggregate(
    [{
      $match:
      {
        volunteer: {$in: students},
        validated: 'accepted',
        start_date: {$gte: start}
      }
    },
    {
      $group: {
        _id: {volunteer: "$volunteer", month: {$month: "$start_date"}, year: {$year: "$start_date"}},
        sum_hours: {$sum: "$hours"}
      }
    },
    {
      $sort: {
        "_id.volunteer": 1,
        "_id.year": 1,
        "_id.month": 1
      }
    }
    ],
    function (err, activities) {
      if (err) console.log(err);
      else {
        var old_student = '',
            old_month,
            old_year,
            i = 1,
            act_length = activities.length,
            perStudent = {},
            mo_hours = [],
            final_activity = [];
        activities.forEach(function (activity) {
          if ((old_student) && (old_student == activity._id.volunteer.toString()))
          {
            console.log("old_stu"+old_student+'dent');
            // if (((activity._id.month == old_month +1) && (old_year == activity._id.year)) || ((activity._id.month == 1) && (old_year < activity._id.year)))
            // {
            //   mo_hours.push({month:activity._id.month, year:activity._id.year, hours: activity.sum_hours});
            // }
            // else if ((activity._id.month != old_month +1) && (old_year == activity._id.year))
            // {
            //   mo_hours.push({month:old_month+1, year:activity._id.year, hours: 0});
            // }
            mo_hours.push({month:activity._id.month, year:activity._id.year, hours: activity.sum_hours});
            if (i == act_length) 
            {
              perStudent.activities = mo_hours;
              final_activity.push(perStudent);
              console.log('final');
            }
          }
          else {
            console.log('else');
            console.log(perStudent);
            if(Object.keys(perStudent).length > 0 || i == act_length)
            {
              console.log('perStudent');
              console.log(perStudent);
              perStudent.activities = mo_hours;
              final_activity.push(perStudent);
              console.log('final');
              console.log(final_activity);
            }
            perStudent = {};
            mo_hours = [];
            perStudent.volunteer = activity._id.volunteer;
            console.log('perStudent volunteer');
            console.log(perStudent);
            mo_hours.push({month:activity._id.month, year:activity._id.year, hours: activity.sum_hours});
            console.log(mo_hours);
          }
          old_student = activity._id.volunteer;
          old_month = activity._id.month;
          old_year = activity._id.year;
          i++;
        })
        Volunteer.populate(final_activity, {path: 'volunteer', select: 'first_name last_name'}, function (err, activities) {
          res.send(activities);
        })
      }
    }
    )  
  })
}

function getHoursPerStudents (university, callback) {
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
    },
    {
      $group: {
        _id: {volunteer: "$volunteer", month: {$month: "$start_date"}, year: {$year: "$start_date"}},
        sum_hours: {$sum: "$hours"}
      }
    },
    {
      $sort: {
        "_id.volunteer": 1,
        "_id.year": 1,
        "_id.month": 1
      }
    }
    ],
    function (err, activities) {
      if (err) callback(err, null);
      else {
        var old_student = '',
            old_month,
            old_year,
            i = 1,
            act_length = activities.length,
            perStudent = {},
            mo_hours = [],
            final_activity = [];
        activities.forEach(function (activity) {
          if ((old_student) && (old_student == activity._id.volunteer.toString()))
          {
            console.log("old_stu"+old_student+'dent');
            // if (((activity._id.month == old_month +1) && (old_year == activity._id.year)) || ((activity._id.month == 1) && (old_year < activity._id.year)))
            // {
            //   mo_hours.push({month:activity._id.month, year:activity._id.year, hours: activity.sum_hours});
            // }
            // else if ((activity._id.month != old_month +1) && (old_year == activity._id.year))
            // {
            //   mo_hours.push({month:old_month+1, year:activity._id.year, hours: 0});
            // }
            mo_hours.push({month:activity._id.month, year:activity._id.year, hours: activity.sum_hours});
            if (i == act_length) 
            {
              perStudent.activities = mo_hours;
              final_activity.push(perStudent);
              console.log('final');
            }
          }
          else {
            console.log('else');
            console.log(perStudent);
            if(Object.keys(perStudent).length > 0 || i == act_length)
            {
              console.log('perStudent');
              console.log(perStudent);
              perStudent.activities = mo_hours;
              final_activity.push(perStudent);
              console.log('final');
              console.log(final_activity);
            }
            perStudent = {};
            mo_hours = [];
            perStudent.volunteer = activity._id.volunteer;
            console.log('perStudent volunteer');
            console.log(perStudent);
            mo_hours.push({month:activity._id.month, year:activity._id.year, hours: activity.sum_hours});
            console.log(mo_hours);
          }
          old_student = activity._id.volunteer;
          old_month = activity._id.month;
          old_year = activity._id.year;
          i++;
        })
        Volunteer.populate(final_activity, {path: 'volunteer', select: 'first_name last_name'}, function (err, activities) {
          if (err) callback(err, null);
          else callback(null, activities);
          // res.send(activities);
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

exports.all = function (req, res) {
  if (req.params.university)
  {
    var university = req.params.university;
    getHoursPerStudents(university, function (err, perMonth) {
      if (err) console.log(err);
      else {
        getHoursPerDiscipline(university, function (err, perDiscipline) {
          if (err) console.log(err);
          else {
            getHoursPerGraduationYear(university, function (err, perGraduationYear) {
              if (err) console.log(err);
              else
              {
                getHoursPerGraduate(university, function (err, perGraduate) {
                  if (err) console.log(err);
                  else
                  {
                    res.render('university/tracking', {
                      title: 'University Tracking: ' + university,
                      user: req.user,
                      perMonth: perMonth, 
                      perDiscipline: perDiscipline, 
                      perGraduationYear: perGraduationYear,
                      perGraduate: perGraduate
                    });
                    // res.send({perMonth: perMonth, 
                    //           perDiscipline: perDiscipline, 
                    //           perGraduationYear: perGraduationYear,
                    //           perGraduate: perGraduate
                    //         });
                  }
                })
              }
            })
          }
        })
      }
    });
  }
  else
  {
    res.send([]);
  }
}



// "position" : "student",
//   "graduation_year" : 2016,
//   "graduate" : "undergraduate",
//   "discipline" : "Law School",
//   "university" : "City University",
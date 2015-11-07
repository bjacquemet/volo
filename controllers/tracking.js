var Activity = require('../models/activity');
var Volunteer = require('../models/volunteer');
var University = require('../models/university');
var UniversityAdminRights = require('../models/university_admin_rights');

exports.newRight = function (req, res) {
    var newRight = UniversityAdminRights({university: req.body.university, right: req.body.right});
    newRight.save()
    // UniversityAdminRights.save({university: req.body.university, right: req.body.right});
}

function getStudentsOfUniversity(university, callback) {
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

function getHoursPerStudent(university, callback) {
    getStudentsOfUniversity(university, function (err, students) {
        var start = new Date(2015, 8, 1);
        Activity.aggregate(
            [{
                $match: {
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
                    if (activities.length > 0) {
                        var old_student = '',
                            old_month,
                            old_year,
                            i = 1,
                            act_length = activities.length,
                            perStudent = {},
                            mo_hours = [],
                            final_activity = [];
                        activities.forEach(function (activity) {
                            if ((old_student) && (old_student == activity._id.volunteer.toString())) {
                                mo_hours.push({
                                    month: activity._id.month,
                                    year: activity._id.year,
                                    hours: activity.sum_hours
                                });
                                if (i == act_length) {
                                    perStudent.activities = mo_hours;
                                    final_activity.push(perStudent);
                                }
                            }
                            else {
                                if (Object.keys(perStudent).length > 0 && i == act_length) {
                                    perStudent.activities = mo_hours;
                                    final_activity.push(perStudent);
                                }
                                perStudent = {};
                                mo_hours = [];
                                perStudent.volunteer = activity._id.volunteer;
                                mo_hours.push({
                                    month: activity._id.month,
                                    year: activity._id.year,
                                    hours: activity.sum_hours
                                });
                                if (i == act_length) {
                                    perStudent.activities = mo_hours;
                                    final_activity.push(perStudent);
                                }
                            }
                            old_student = activity._id.volunteer;
                            i++;
                        })
                        Volunteer.populate(final_activity, {
                            path: 'volunteer',
                            select: 'first_name last_name'
                        }, function (err, activities) {
                            if (err) callback(err, null);
                            else callback(null, activities);
                            // res.send(activities);
                        })
                    }
                    else {
                        callback(null, null);
                    }
                }
            }
        )
    })
}

// Discipline = Area of Study
function getHoursPerDiscipline(university, callback) {
    var start = new Date(2015, 8, 1);
    getStudentsOfUniversity(university, function (err, students) {
        // find disciplines and foreach discipline, list of students
        Volunteer.aggregate([
            {
                $match: {
                    "_id": {$in: students}
                }
            },
            {
                $group: {
                    _id: "$area_of_study",
                    students: {$push: "$_id"}
                }
            }
        ], function (err, disciplines) {
            if (err) callback(err, null);
            var hours_per_discipline = [],
                discipline_length = disciplines.length,
                i = 1;
            // for each discipline and list of students
            // get activities per month
            disciplines.forEach(function (discipline) {
                Activity.aggregate(
                    [{
                        $match: {
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
                                console.log(hours_per_discipline);
                                callback(null, hours_per_discipline);
                            }
                            else i++;
                        }
                    })
            })
        })
    })
}

function getHoursPerGraduationYear(university, callback) {
    var start = new Date(2015, 8, 1);
    getStudentsOfUniversity(university, function (err, students) {
        // find graduation_years and foreach graduation_year, list of students
        Volunteer.aggregate([
            {
                $match: {
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
            if (err) callback(err, null);
            var hours_per_graduation_year = [],
                graduation_year_length = graduation_years.length,
                i = 1;
            // for each graduation_year and list of students
            // get activities per month
            graduation_years.forEach(function (graduation_year) {
                Activity.aggregate(
                    [{
                        $match: {
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

function getHoursPerGraduate(university, callback) {
    // undergraduate vs postgraduate
    var start = new Date(2015, 8, 1);
    getStudentsOfUniversity(university, function (err, students) {
        // find graduate type and foreach graduate type, list of students
        Volunteer.aggregate([
            {
                $match: {
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
            if (err) callback(err, null);
            var hours_per_graduate = [],
                graduates_length = graduates.length,
                i = 1;
            // for each graduation_year and list of students
            // get activities per month
            graduates.forEach(function (graduate) {
                Activity.aggregate(
                    [{
                        $match: {
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

function getHoursPerActiveStatus(university, callback) {
    getStudentsOfUniversity(university, function (err, students) {
        var students_array = [],
            student_length = students.length,
            i = 1,
            today = Date.now(),
            status = '',
            last_sign_in;
        students.forEach(function (student) {
            Volunteer.findById(student, "first_name last_name last_sign_in", function (err, student) {
                if (err) callback(err, null);
                else {
                    last_sign_in = new Date(student.last_sign_in);
                    // 2629746000 = 1 month in milliseconds
                    status = ((today - last_sign_in) > 2629746000) ? 'Non-active' : 'Active';
                    students_array.push({
                        student: {first_name: student.first_name, last_name: student.last_name},
                        status: status
                    });
                    if (i == student_length) {
                        callback(null, students_array)
                    }
                    i++;
                }
            })
        })
    })
}

function universityExists(university, callback) {
    University.findOne({name: new RegExp('^' + university + '$', 'i')}, function (err, university) {
        if (err) {
            console.log(err);
            callback(err, null);
        }
        else {
            console.log(university);
            if (university != null) callback(null, university._id);
            else callback(null, null);
        }
    })
}

function isAuthorized(req, res, university, callback) {
    if (req.user) {
        if (req.user.usertype.indexOf('admin') > 0) {
            callback(true);
        }
        else {
            UniversityAdminRights.findOne({university: university}).exec(function (err, university) {
                if (err) console.log(err);
                else {
                    if (university) {
                        if (req.user.usertype.indexOf(university.right) > 0) callback(true);
                        else callback(false);
                    }
                    else callback(false);
                }
            })
            // TODO: not working if ID, is it?
            // Idea is to change that to a matching document in mongolab
            // switch(university) {
            //   case "University of Westminster":
            //     if (req.user.usertype.indexOf('westminster') > 0) callback(true);
            //     else callback(false);
            //     break;
            //   case "City University":
            //     if (req.user.usertype.indexOf('city') > 0) callback(true);
            //     else callback(false);
            //     break;
            //   default:
            //     callback(false);
            //     break;
            // }
        }
    }
    else callback(false);
}

exports.all = function (req, res) {
    if (req.params.university) {
        universityExists(req.params.university, function (err, university) {
            if (err) console.log(err);
            else {
                if (university) {
                    isAuthorized(req, res, university, function (authorization) {
                        if (authorization) {
                            getHoursPerStudent(university, function (err, perMonth) {
                                if (err) console.log(err);
                                else if (perMonth == null) {
                                    res.render('university/tracking', {
                                        title: 'University Tracking',
                                        user: req.user,
                                        perMonth: []
                                    });
                                }
                                else {
                                    getHoursPerDiscipline(university, function (err, perDiscipline) {
                                        if (err) console.log(err);
                                        else {
                                            getHoursPerGraduationYear(university, function (err, perGraduationYear) {
                                                if (err) console.log(err);
                                                else {
                                                    getHoursPerGraduate(university, function (err, perGraduate) {
                                                        if (err) console.log(err);
                                                        else {
                                                            getHoursPerActiveStatus(university, function (err, perStatus) {
                                                                if (err) console.log(err);
                                                                else {
                                                                    console.log(perMonth);
                                                                    res.render('university/tracking', {
                                                                        title: 'University Tracking: ' + req.params.university,
                                                                        user: req.user,
                                                                        perMonth: perMonth,
                                                                        perDiscipline: perDiscipline,
                                                                        perGraduationYear: perGraduationYear,
                                                                        perGraduate: perGraduate,
                                                                        perStatus: perStatus
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
                                    })
                                }
                            });
                        }
                        else {
                            res.render('university/tracking', {
                                title: 'University Tracking',
                                user: req.user
                            });
                        }
                    });
                }
                else {
                    res.render('university/tracking', {
                        title: 'University Tracking',
                        user: req.user
                    });
                }
            }
        });
    }
    else {
        res.render('university/tracking', {
            title: 'University Tracking',
            user: req.user
        });
    }
}
var University = require('../models/university');

exports.list = function (req, res) {
    University.find({}).sort({name: 1}).select('_id name').exec(function (err, universities) {
        if (err) {
            res.status(400);
            res.send('error');
        }
        else {
            var universityList = [];
            universities.forEach(function (university) {
                // formating the data to be readable by x-editable library
                universityList.push({value: university._id, text: university.name});
            })
            // console.log(universityList);
            res.send(universityList);
        }
    });
};

exports.new = function (req, res) {
    console.log(req.body);
    if (!req.body.name || !req.body.suggested_by_volunteer || !req.body.created_by) {
        res.status(400);
        res.send('Field(s) missing');
    }
    else {
        var name = req.body.name;
        if (Object.prototype.toString.call(name) === '[object Array]') {
            var name_is_array = true;
            name = name[0];
        }
        var sbv = req.body.suggested_by_volunteer;
        var created_by = req.body.created_by;
        var newUniversity = University(
            {
                name: name,
                suggested_by_volunteer: sbv,
                created_by: created_by
            });
        newUniversity.save(function (err, uni) {
            if (err) {
                res.status(400);
                res.send('This nonprofit already exists.');
            }
            else {
                if (name_is_array) {
                    res.status(201).send('Only ' + name + ' has been created. Only one university can be added at a time');
                }
                else {
                    res.status(201);
                    res.send(uni);
                }
            }
        })
    }
};

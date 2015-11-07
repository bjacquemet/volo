var Nonprofit = require('../models/nonprofit');

exports.list = function (req, res) {
    Nonprofit.find({}).sort({name: 1}).select('_id name').exec(function (err, nonprofits) {
        res.send(nonprofits);
    });
};

exports.new = function (req, res) {
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
        var newNonprofit = Nonprofit(
            {
                name: name,
                suggested_by_volunteer: sbv,
                created_by: created_by
            });
        newNonprofit.save(function (err) {
            if (err) {
                res.status(400);
                res.send('This nonprofit already exists.');
            }
            else {
                if (name_is_array) {
                    res.status(201).send('Only ' + name + ' has been created. Only one nonprofit can be added at a time');
                }
                else res.sendStatus(201);
            }
        })
    }
};

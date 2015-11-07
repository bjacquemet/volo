var Role = require('../models/role');

function lowerToCapitalize(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

exports.list = function (req, res) {
    Role.find({}).sort({name: 1}).select('_id name').exec(function (err, roles) {
        if (err) res.sendStatus(400);
        else {
            var array_role = [],
                name = '';
            roles.forEach(function (role) {
                name = lowerToCapitalize(role.name);
                array_role.push({_id: role._id, name: name})
            })
            res.send(array_role);
        }
    });
};

// TODO: save all roles as lowercase
// TODO: on display, capitalize first letter of each word
exports.new = function (req, res) {
    if (!req.body.name || !req.body.suggested_by_volunteer || !req.body.created_by) {
        res.status(400);
        res.send('Field(s) missing');
    }
    else {
        var name = req.body.name;
        name = name.toLowerCase();
        if (Object.prototype.toString.call(name) === '[object Array]') {
            var name_is_array = true;
            name = name[0];
        }
        var sbv = req.body.suggested_by_volunteer;
        var created_by = req.body.created_by;
        var newRole = Role(
            {
                name: name,
                suggested_by_volunteer: sbv,
                created_by: created_by
            });
        newRole.save(function (err) {
            if (err) {
                res.status(400);
                res.send('This role already exists.');
            }
            else {
                if (name_is_array) {
                    res.status(201).send('Only ' + name + ' has been created. Only one role can be added at a time');
                }
                else res.sendStatus(201);
            }
        })
    }
};
var models = require('../models/index');
var User = require('../models/user');

exports.create = function(req, res){
    models.User.create({
        name: req.body.name,
        email: req.body.email
    }).then(function(user){
        res.json(user);
    });
};

exports.list = function(req, res){
    models.User.findAll({})
        .then(function(users){
            res.json(users);
        });
};
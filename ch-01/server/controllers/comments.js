var gravatar = require('gravatar');
var Comments = require('../models/comments');

exports.list = function(req, res){
    Comments.find().sort('-created').populate('user', 'local.email').exec(function(error, comments){
        if(error){
            return res.send(400, {
                message: error
            });
        }

        res.render('comments', {
            title: 'Comments Page',
            comments: comments,
            gravatar: gravatar.url(comments.email, {
                s: '80',
                r: 'x',
                d: 'retro'
            }, true)
        });
    });
};

exports.create = function(req, res){
    var comments = new Comments(req.body);
    comments.user = req.user;
    comments.save(function(error){
        if(error){
            return res.send(400, {
                message : error
            });
        }

        res.redirect('/comments');
    });
};

exports.hasAuthorization = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }

    res.redirect('/login');
};
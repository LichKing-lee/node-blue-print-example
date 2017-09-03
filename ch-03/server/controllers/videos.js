var fs = require('fs');
var mime = require('mime');
var gravatar = require('gravatar');
var Videos = require('../models/videos');
var VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg', 'video/ogv'];

exports.show = function(req, res){
	Videos.find().sort('-created').populate('user', 'local.email').exec(function(err, videos){
		if(err){
			return res.status(400).send({
				message: err
			});
		}

		console.log(videos);
		res.render('videos', {
			title: 'Videos Page',
			videos: videos,
			gravatar: gravatar.url(videos.email, {
				s: '80',
				r: 'x',
				d: 'retro'
			}, true)
		});
	});
};

exports.uploadVideo = function(req, res){
	console.log(req);
	var tempPath = req.file.path;
	var type = mime.lookup(req.file.mimetype);

	if(!VIDEO_TYPES.contains(type)){
		return res.status(415).send('Not supported video format');
	}

	var targetPath = './public/videos/' + req.file.originalname;
	var src = fs.createReadStream(tempPath);
	var dest = fs.createWriteStream(targetPath);
	src.pipe(dest);

	src.on('error', function(err){
		if(err){
			return res.status(500).send({
				message: err
			});
		}
	});

	src.on('end', function(){
		var video = new Videos(req.body);
		video.videoName = req.file.originalname;
		video.user = req.user;

		video.save(function(err){
			if(err){
				res.status(400).send({
					message: err
				});
			}
		});

		fs.unlink(tempPath, function(err){
			if(err){
				res.status(500).send({
					message: err
				});
			}

			res.redirect('videos');
		});
	});
};

exports.hasAuthorization = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}

	res.redirect('/login');
};

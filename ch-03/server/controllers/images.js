var fs = require('fs');
var mime = require('mime');
var gravatar = require('gravatar');
var Images = require('../models/images');
var IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

exports.show = function(req, res){
	Images.find().sort('-created').populate('user', 'local.email').exec(function(error, images){
		if(error){
			return res.status(400).send({
				message: error
			});
		}

		res.render('images-gallery', {
			title: 'Images Gallery',
			images: images,
			gravatar: gravatar.url(images.email, {
				s: '80',
				r: 'x',
				d: 'retro'
			}, true)
		});
	});
};


exports.uploadImage = function(req, res){
	var tempPath = req.file.path;
	console.log(req.file);
	var type = mime.lookup(req.file.mimetype);

	if(!IMAGE_TYPES.contains(type)){
		return res.status(415).send('Not supported image format');
	}

	var targetPath = './public/images/' + req.file.originalname;
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
		var image = new Images(req.body);
		image.imageName = req.file.originalname;
		image.user = req.user;
		image.save(function(err){
			if(err){
				res.status(400).send({
					message: err
				});
			}
		});

		fs.unlink(tempPath, function(err){
			if(err){
				return res.status(500).send('something bad happened here');
			}

			res.redirect('images-gallery');
		});
	});
};

exports.hasAuthorization = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}

	res.redirect('/login');
};

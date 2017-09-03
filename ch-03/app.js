var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var multer = require('multer');
var upload = multer({
	dest: './public/uploads',
	limits: {
		fileSize: 1000000,
		files: 1
	}
});

var index = require('./server/controllers/index');
var auth = require('./server/controllers/auth');
var comments = require('./server/controllers/comments');
var videos = require('./server/controllers/videos');
var images = require('./server/controllers/images');

var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var flash = require('connect-flash');
var app = express();

app.set('views', path.join(__dirname, 'server/views/pages'));
app.set('view engine', 'ejs');

var config = require('./server/config/config.js');

mongoose.connect(config.url);
mongoose.connection.on('error', function(){
	console.error("MongoDB Connection Error. Make sure MongoDB is running");
});

require('./server/config/passport')(passport);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(require('node-sass-middleware')({
	src: path.join(__dirname, 'public'),
	dest: path.join(__dirname, 'public'),
	indentedSyntax: true,
	sourceMap : true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
	secret: 'sometextgohere',
	saveUninitialized: true,
	resave: true,
	store: new MongoStore({
		url: config.url,
		collection: 'sessions'
	})
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.get('/', index.show);
app.get('/login', auth.signin);
app.post('/login', passport.authenticate('local-login', {
	successRedirect: '/profile',
	failureRedirect: '/login',
	failureFlash: true
}));
app.get('/signup', auth.signup);
app.post('/signup', passport.authenticate('local-signup', {
	successRedirect: '/profile',
	failureRedirect: '/signup',
	failureFlash: true
}));
app.get('/profile', auth.isLoggedIn, auth.profile);
app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

app.get('/comments', comments.hasAuthorization, comments.list);
app.post('/comments', comments.hasAuthorization, comments.create);

app.get('videos', videos.hasAuthorization, videos.show);
app.post('videos', videos.hasAuthorization, upload.single('video'), videos.uploadVideo);

app.post('/images', images.hasAuthorization, upload.single('image'), images.uploadImage);
app.get('images-gallery', images.hasAuthorization, images.show);

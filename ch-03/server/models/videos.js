var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var videoSchema = mongoose.Schema({
	create: {
		type: Date,
		default: Date.now
	},
	title : {
		type: String,
		default: '',
		trim: true,
		required: 'Title cannot be blank'
	},
	videoName: {
		type: String
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

module.exports = mongoose.model('Videos', videoSchema);

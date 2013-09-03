var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var AnswerSchema = new Schema({
	username: {type: String, index: true},
	question_num: {type: Number},
	code: {type: String},
	question: {type: String},
	results: {type: String},
	correct: {type: Boolean}
});

module.exports = mongoose.model('answers', AnswerSchema);
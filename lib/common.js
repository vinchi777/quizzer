var fs = require('fs');
var path = require('path');

var question_file = 'questions/mongodb_q';
var ans_file = 'answers/mongodb_a';
var location = path.resolve('..', 'quizzer' ,'quizzes');

exports.getQuestion = function (num, callback) {
	fs.readFile(path.join(location, question_file + num), {encoding: 'utf8'}, function (err, data) {
		callback(err, data);
	});
}

exports.getAnswer = function (num, callback) {
	fs.readFile(path.join(location, ans_file + num), {encoding: 'utf8'}, function (err, data) {
		callback(err, data);
	});
}
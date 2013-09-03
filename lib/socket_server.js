var io = require('socket.io');
var	cookie = require('cookie');
var	parseCookie = require('connect').utils.parseSignedCookies;

var config = require('../config');
var common = require('./common');
var Answer = require('../models/answers');

var	Sandbox = require('./sandbox');
var sandbox = new Sandbox({ timeout: 5000 });
var wrapper = require('./mongo_cmd').wrapper;

var currentQuestionNum = 0;

exports.setup = function (server, sessionStore) {
	io = io.listen(server);

	io.set('authorization', function (handshake, ack) {
		var cookies = parseCookie(cookie.parse(decodeURIComponent(handshake.headers.cookie)), config.sessionSecret);
		sessionStore.get(cookies['connect.sid'], function (err, sessionData) {
			handshake.session = sessionData || {};
			handshake.sid = cookies['connect.sid']|| null;
			ack(err, err ? false : true);
		});
	});

	io.sockets.on('connection', function (client) {
		var user = client.handshake.session.passport.user;

		io.sockets.emit('connected', user);

		client.on('code', function (code, callback) {
			console.log(code);
			sandbox.run({ code: code }, function (output) {
				common.getAnswer(currentQuestionNum, function (err, data) {
					var correct = (data === output.result);
					Answer.update({ username: user.username, question_num: currentQuestionNum },
								{code: code, results: output, correct: correct},
								{upsert: true}, 
						function (err, res) {
							if (err) return callback({ results: err });
							callback(output);
					});
				});
			});
		});


		// Admin events 
		client.on('startQuiz', function (callback) {
			currentQuestionNum = 1;
			callback(currentQuestionNum);
		});

		client.on('afk', function () {
			io.sockets.emit('afk');
		});

		client.on('showResults', function () {
			Answer.findOne({ username: user.username, question_num: currentQuestionNum }, function (err, doc) {
				io.sockets.emit('results', doc.correct);
			});
		});

		client.on('newQuestion', function (num, callback) {
			currentQuestionNum = parseInt(num);
			common.getQuestion(num, function (err, data) {
				callback(data);
				io.sockets.emit('question', data);
			});
		});
	});
};
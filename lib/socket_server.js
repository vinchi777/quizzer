var io = require('socket.io');
var _ = require('underscore');
var util = require('util');
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

		client.on('connect', function () {
			if (currentQuestionNum !== 0) {
				common.getQuestion(currentQuestionNum, function (err, data) {
					io.sockets.emit('question', data);
				});
			}
		});

		client.on('disconnect', function () {
			io.sockets.emit('disconnected', user);
		});

		client.on('code', function (userCode, callback) {
			var wrappedCode = wrapper(userCode, user.username);
			sandbox.run({ code: wrappedCode }, function (output) {
				common.getAnswer(currentQuestionNum, function (err, data) {
					var correct;
					try {
						correct = _.isEqual(JSON.parse(data), output.result);
					} catch (err) {
						correct = false;
					}
					// Turn it back to string for display in browser
					output = { result: util.inspect( output.result ), console: output.console };

					Answer.update({ username: user.username, question_num: currentQuestionNum },
								{code: userCode, output: output, correct: correct},
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
			if (currentQuestionNum !== 0) {
				// Client sockets are stored as <handshake_id> : <socket> pairs in io.handshaken
				_.each(_.keys(io.handshaken), function (handshake, index) {
					// Get client details from handshakes
					var client = io.handshaken[handshake];
					var username = client.session.passport.user.username;
					// Using a closure to avoid using the last traversed key in findOne
					(function (username, handshake) {
						Answer.findOne({ username: username, question_num: currentQuestionNum }, function (err, doc) {
							if (err) throw err;
							var client = io.sockets.sockets[handshake];
							client.emit('results', doc.correct);
						});
					})(username, handshake);
				});
			}
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
var mongoose = require('mongoose'),
	config = require('../config');

exports.mongoose = mongoose;
mongoose.connection.on('error', console.error.bind(console, 'connection error: '));
mongoose.connection.on('open', function () {
	console.log('Mongoose connection OK!');
});

if (mongoose.connection.readyState == 0) {
	exports.db = mongoose.connect(config.mongo_url);
}
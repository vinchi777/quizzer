var io = require('socket.io');
	Sandbox = require('./sandbox'),
	wrapper = require('./mongo_cmd').wrapper;

exports.setup = function (server) {
	io = io.listen(server);

	var sandbox = new Sandbox();

	io.sockets.on('connection', function (client) {
		console.log('connection established');

		client.on('code', function (data, callback) {
			console.log(data);
			sandbox.run({ code: data }, function (output) {
				// use assert here to check output.results 
				// extend output object with assert results
				callback(output);
			});
		});
	});
}
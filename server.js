var http = require('http');
var Sandbox = require('./lib/sandbox');

http.createServer(function (req, res) {

	var sandbox = new Sandbox();

	var snippet = '';

	req.setEncoding('utf8');
	req.on('data', function(chunk) {
		snippet += chunk;
	});

	req.on('end', function () {
		sandbox.run({ code: testConnection(snippet) }, function (output) {
			console.log(output);
			res.end();
		});
	});

}).listen(9000);

function testConnection(snippet) {
	var code = "".concat(
				'var MongoClient = require("mongodb").MongoClient;',
				'var conn = new MongoClient();',
				'conn.connect("mongodb://localhost:27017/test", function (err, db) {',
				'	if (err) return console.log(err);',
				'	console.log("Connection established!");',
				snippet,
				'});'
			);
	return code;
}
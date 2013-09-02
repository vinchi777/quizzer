exports.wrapper = function (options) {
	var code = "".concat(
		'var MongoClient = require("mongodb").MongoClient;',
		'var conn = new MongoClient();',
		'conn.connect("mongodb://localhost:27017/' + options.db + '", function (err, db) {',
		'	if (err) return console.log(err);',
		'	console.log("Connection established!");',
		options.snippet,
		'});'
	);
	return code;
}
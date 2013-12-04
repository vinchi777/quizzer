exports.wrapper = function (snippet, db) {
  console.log();
	var code = "".concat(
		'var MongoClient = require("mongodb").MongoClient;',
		'var conn = new MongoClient();',
		'conn.connect("mongodb://localhost:27017/quizzer", function (err, db) {',
		'		if (err) return console.log(err);',
		'		console.log("Connection established!");',
		snippet,
		'});'
	);
	return code;
}

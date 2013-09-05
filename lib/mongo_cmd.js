exports.wrapper = function (snippet, db) {
	var code = "".concat(
		'var MongoClient = require("mongodb").MongoClient;',
		'var conn = new MongoClient();',
		'conn.connect("mongodb://localhost:27017/' + db + '", function (err, db) {',
		'	db.authenticate("quizzer", "quizzer", {authdb: "admin"}, function (err, result) {',
		'		if (err) return console.log(err);',
		'		console.log("Connection established!");',
		snippet,
		'	})',
		'});'
	);
	return code;
}
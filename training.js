var MongoClient = require('mongodb').MongoClient;
var _ = require('underscore');

MongoClient.connect('mongodb://localhost:27017/school', function (err, db){
	if (err) return console.log(err);

	var studs = db.collection('students');
	studs.count(function (num) {
		console.log(num);
	});
	console.log(studs.count());
	// studs.find().each(function (err, doc) {
	// 	if (doc) {
	// 		var scores = doc.scores;
	// 		// get homeworks and sort by descending order
	// 		var homeworks = _.sortBy(_.where(doc.scores, {type: 'homework'}), function (obj) { return -obj.score; });
	// 		// if more than one homeworks, remove the lowest
	// 		if (homeworks.length > 1) {
	// 			var lowest = homeworks.pop();
	// 			scores = _.without(scores, lowest);
	// 		}
	// 		studs.update({ _id: doc._id}, { $set: { scores: scores }}, function (err, res) {
	// 			if (err) return console.log(err);
	// 			console.log(res);
	// 		});
	// 	}
	// });
})
var MongoClient = require('mongodb').MongoClient;
var _ = require('underscore');

function done(doc) {
	console.log(doc);
}

MongoClient.connect('mongodb://localhost:27017/jsantos', function (err, db){
	if (err) return console.log(err);
	db.authenticate('quizzer', 'quizzer', {authdb: 'admin'}, function (err, result) {
		console.log('result: ', result);
		var blogs = db.collection('blogs');
		blogs.remove({}, {w: 0});
		blogs.insert({
		  "_id": 1,
		  "content" : "...",
		  "comments" : [
		    {
		      "author" : "joe",
		      "score" : 3,
		      "comment" : "nice post"
		    },
		    {
		      "author" : "mary",
		      "score" : 6,
		      "comment" : "terrible post"
		    }
		  ]
		}, function (err, doc) {
			if (err) done(err);
			done(doc[0]);
		});
	});

	// var reviews = db.collection('reviews');

	// reviews.insert({
	// 	"restaurant" : "Le Cirque",
	// 	"review" : "Hamburgers were overpriced.",
	// 	"tags" : [],
	// 	"garbage": Array(100).join('.')
	// }, function (err, doc) {
	// 	if (err) return console.log(err);
	// 	console.log(doc[0]);
	// 	console.log('Buffer size: ', Buffer.byteLength(doc[0].garbage, 'utf8'));
	// });
	// var studs = db.collection('students');
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
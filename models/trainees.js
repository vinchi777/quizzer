var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var TraineeSchema = new Schema({
	username: {type: String, index: true},
	name: {type: String},
	password: {type: String}
});

TraineeSchema.statics.getInfo = function (username, password, callback) {
	return this.findOne({ username: username, password: password }, callback);
}

module.exports = mongoose.model('trainees', TraineeSchema);
exports.isAdmin = function (req, res, next) {
	if (req.session.passport.user.admin) { return next(); }
	res.render('404');
}

exports.admin = function (req, res) {
	res.render('admin');
}

exports.setup = function (app) {
	app.get('/quizzer', exports.isAdmin, exports.admin);
}
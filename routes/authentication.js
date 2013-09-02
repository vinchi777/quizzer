var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	Trainee = require('../models/trainees');

passport.use(new LocalStrategy(function (username, password, done) {
	Trainee.getInfo(username, password, function (err, trainee) {
		if (err) {
			return done(err);
		}
		if (!trainee) {
			return done(null, false);
		}
		return done(null, trainee);
	});
}));

passport.serializeUser(function (user, done) {
	done(null, user._id);
});

passport.deserializeUser(function (id, done) {
	Trainee.findById(id, function (err, user){
		done(err, user);
	});
});

exports.loginPage = function (req, res) {
	res.render('login');
}

exports.login = passport.authenticate('local', {
  successReturnToOrRedirect : '/',
  failureRedirect : '/login'
});

exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
}

exports.ensureAuthenticated = function (req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.redirect('/login');
}

exports.setup = function (app) {
	app.use(passport.initialize());
	app.use(passport.session());

	app.get('/login', exports.loginPage);
	app.post('/login', exports.login);
	app.get('/logout', exports.logout);
}
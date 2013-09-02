var Sandbox = require('./lib/sandbox'),
	join = require('path').join,
	config = require('./config');

var express = require('express'),
	app = express(),
	server = require('http').createServer(app);

var db = require('./lib/mongo_connection');
var auth = require('./routes/authentication');
var sockets = require('./lib/socket_server');

app.configure(function (){
	app.set('view engine', 'ejs');
	app.set('views', join(__dirname, 'views'));
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
  	app.use(express.cookieParser('seecreet'));
  	app.use(express.session());
	auth.setup(app);
	sockets.setup(server);
	app.use(app.router);
	app.use(express.static(join(__dirname, 'public')));
});

app.get('/', auth.ensureAuthenticated, function (req, res) {
	res.render('index');
});

server.listen(config.app_port, config.app_host, function () {
	var addr = server.address();
	console.log('Quizzer listening on http://' + addr.address + ':' + addr.port);
});
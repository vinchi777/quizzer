var Sandbox = require('./lib/sandbox'),
	join = require('path').join,
	config = require('./config');

var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	RedisStore = require('connect-redis')(express);

// RedisStore to be used instead of express sessionStore
var sessionStore = new RedisStore(config.redis);

var db = require('./lib/mongo_connection'),
	sockets = require('./lib/socket_server'),
	auth = require('./routes/authentication'),
	admin = require('./routes/admin');

app.configure(function (){
	app.set('view engine', 'ejs');
	app.set('views', join(__dirname, 'views'));
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
  	app.use(express.cookieParser());
  	app.use(express.session({
  		store : sessionStore,
  		secret: config.sessionSecret 
  	}));
	auth.setup(app);
	sockets.setup(server, sessionStore);
	app.use(app.router);
	admin.setup(app);
	app.use(express.static(join(__dirname, 'public')));
});

app.get('/', auth.ensureAuthenticated, function (req, res) {
	res.render('index');
});

server.listen(config.app_port, config.app_host, function () {
	var addr = server.address();
	console.log('Quizzer listening on http://' + addr.address + ':' + addr.port);
});

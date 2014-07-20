
/**
 * Module dependencies
 */

var express = require('express'),
  routes = require('./routes'),
  api = require('./routes/api'),
  http = require('http'),
  path = require('path');

var app = module.exports = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
//svar twilio = require("twilio")('AC79502ebcbac523a3601433f2b7eb1fa8', '2611d6710b71ac4143eefb4bc9a1ecfe');

/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
//app.use(express.logger('dev'));
io.set('log level', 1); 
app.use(express.bodyParser());
app.use(express.json());   
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

var pubNubService = require("./services/pubNubService");

// development only
if (app.get('env') === 'development') {
  app.use(express.errorHandler());
}

// production only
if (app.get('env') === 'production') {
  // TODO
};


/**
 * Routes
 */

// serve index and view partials
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// JSON API
app.get('/api/locations', api.locations);
app.post("/api/addDestination", api.addDestination);
app.post("/api/locations", api.addLocation);
app.post("/api/endDestination", api.endDestination);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Socket.io Communication
io.sockets.on('connection', require('./routes/socket'));

/**
 * Start Server
 */

server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});

var gm = require('googlemaps');
var util = require('util');

var mongoose = require('mongoose');
  //var MONGOHQ_URL="mongodb://user:pass@server.mongohq.com:port_name/db_name"
mongoose.connect('mongodb://test:test@kahana.mongohq.com:10063/angelHack', function(err){
    if(err){
      console.log(err);
    }else{
      console.log('Connected to Mongodb.');
    }
  });

var pubNubService = require("./services/pubNubService");
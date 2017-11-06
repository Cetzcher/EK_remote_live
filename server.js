var express = require('express'),
  app = express(),
  port = process.env.PORT || 9001;  // changed port from 3030

var mongoose = require('mongoose');

//Set up default mongoose connection
var mongoDB = 'mongodb://localhost:28000/my_database';
mongoose.connect(mongoDB, {
  useMongoClient: true
});

//Get the default connection
var db = mongoose.connection;

var bodyParser  = require('body-parser');
var config      = require('./config/database'); // get db config file
var User        = require('./app/models/user'); // get the mongoose model
var expressWs = require('express-ws')(app);


// get our request parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs'); // setup ejs as rendering engine for dynamic content.
app.set('views', __dirname + "/app/views");



/*
	DEFINE CORE REST FUNCTIONS HERE
	IN PRODUCTION, THIS SHOULD BE WITHIN IT'S
	OWN DEDICATED FILE, FOR THE SAKE OF SIMPLICITY
	THIS WILL BE IMPLENTED HERE.

	since mongoose is asnyc direct return values cannot be accessed,
	use callback(reslut) whereas result is a object simmilar to:
	{success: bool, error: errors_if_any }

*/

app.all('/*', function(req, res, next) {
  // CORS headers
 	res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
 	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
 	res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');

  	if (req.method == 'OPTIONS') {
    	res.status(200).end();
  	} else {
  		// go to next router.
    	next();
  	}
});

app.use('/api', require(__dirname + '/app/routes')); // dispatch to routers 

// when no route has been found, serve 404.
app.use("/*", function(req, res, next) {
	res.status = 404;
	res.json({msg: "404"});
});


app.listen(port);
console.log('There will be dragons: http://localhost:' + port);
console.log("views @: " + __dirname + "/app/views");
console.log(__dirname + '/app/routes/websocketRoutes');
console.log(mongoDB);
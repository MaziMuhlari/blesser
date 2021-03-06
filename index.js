// modules =================================================
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var mongoose       = require('mongoose');
var passport       = require('passport');
var expressSession = require('express-session');
var flash          = require('connect-flash');
var exphbs         = require('express-handlebars');
var path           = require('path');

// configuration ===========================================

// set our port
var port = process.env.PORT || 5000;

// Database config files
var db = require('./cloud/config/db');

// Connect to our mongoDB database
mongoose.connect(db.url);

// get all data/stuff of the body (POST) parameters
// parse application/json
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

// set the static files location /web/img will be /img for users
app.use(express.static(__dirname + '/web'));

// configure passport and passport local for session and authentication
app.use(expressSession({secret: 'adsfaqweasdfashoiauhe'}));
app.use(passport.initialize());
app.use(passport.session());

// Initialize Passport
var initPassport = require('./cloud/config/passport/init');
initPassport(passport);


// Using the flash middleware provided by connect-flash to store messages in session
// and displaying in templates
app.use(flash());

// Handlebars
app.set('views', path.join(__dirname, '/web/tmpl'));
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: path.join(__dirname, '/web/tmpl/layouts'),
  partialsDir: path.join(__dirname, '/web/tmpl/partials')
}));
app.set('view engine', '.hbs');

// routes ==================================================
require('./cloud/config/routes')(app, passport); // configure our routes

// start app ===============================================
// startup our app at http://localhost:5000
app.listen(port);

// shoutout to the user
console.log('Magic happens on port ' + port);

// expose app
exports = module.exports = app;

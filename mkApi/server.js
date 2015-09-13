// call the packages we need
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var configDB = require('./config/database.js');
var migrations = require('./migrations/migrations');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms


app.set('view engine', 'ejs'); // set up ejs for templating
app.engine('html', require('ejs').renderFile);

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport, express.Router()); // load our routes and pass in our app and fully configured passport
app.use(express.static(__dirname + '/mkWeb'));
app.use(express.static(__dirname + '/static'));
app.use(function(req, res, next) {
    res.status(404).redirect('/');
});

// launch ======================================================================
migrations.run()
    .then(function () {
        app.listen(port);
        console.log('The magic happens on port ' + port);
    }).fail(function (error) {
        console.error('Migrations was failed. ', error);
    });

var dashboardController = require('./controllers/dashboard');
var categoryController = require('./controllers/category');
var currencyController = require('./controllers/currency');
var accountController = require('./controllers/account');
var transactionController = require('./controllers/transaction');


module.exports = function (app, passport, router) {
    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', isLoggedIn, function (req, res) {
        res.render('../mkWeb/index.html'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function (req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', {message: req.flash('loginMessage')});
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function (req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', {message: req.flash('signupMessage')});
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function (req, res) {
        res.render('profile.ejs', {
            user: req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/login');
    });

    // =================================================================================================================
    // === Register API routes =========================================================================================
    // =================================================================================================================
    router.get('/', function (req, res) {
        res.json({message: 'Welcome to MoneyKeeper API'});
    });
    // ----------------------------------------------------
    dashboardController.registerRoutes(router, isAuthorized, sendError);
    accountController.registerRoutes(router, isAuthorized, sendError);
    categoryController.registerRoutes(router, isAuthorized, sendError);
    currencyController.registerRoutes(router, isAuthorized, sendError);
    transactionController.registerRoutes(router, isAuthorized, sendError);
    // all of our routes will be prefixed with /api
    app.use('/api', router);
    // =================================================================================================================
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        console.log('logged in');

        return next();
    }

    res.redirect('/login');
}

function isAuthorized(req, res, next) {
    if (!req.user) {
        res.status(401);
        res.send({
            error: 'Not authorized'
        });

        return;
    }

    next();
}

function sendError(error, response) {
    if (error) {
        response.status(error.status || 500);
        response.send({
            message: error.message
        });
    }
}

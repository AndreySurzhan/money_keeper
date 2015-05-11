
var dashboardController = require('./controllers/dashboard');
var subscriberController = require('./controllers/subscriber');
var categoryController = require('./controllers/category');
var currencyController = require('./controllers/currency');
var accountController = require('./controllers/account');
var transactionController = require('./controllers/transaction');


module.exports = function (app, passport, router) {

    // =================================================================================================================
    // === App page ====================================================================================================
    // =================================================================================================================
    app.get('/', function (req, res) {
        res.redirect('/subscribe');
    });

    app.get('/app', isLoggedIn, function (req, res) {
        res.render('../mkWeb/index.html');
    });

    // =================================================================================================================
    // === Static pages ================================================================================================
    // =================================================================================================================

    // --- Log in ---

    app.get('/login', function (req, res) {
        res.render(
            'login.ejs',
            {
                message: req.flash('loginMessage')
            }
        );
    });
    app.post(
        '/login',
        passport.authenticate(
            'local-login',
            {
                successRedirect: '/app',
                failureRedirect: '/login',
                failureFlash: true // allow flash messages
            }
        )
    );

    // --- log out ---

    app.get(
        '/logout',
        function (req, res) {
            req.logout();
            res.redirect('/login');
        }
    );

    // --- Sign up ---

    app.get('/signup', function (req, res) {
        res.redirect('/'); // temporary close registration

        res.render(
            'signup.ejs',
            {
                message: req.flash('signupMessage')
            }
        );
    });

    // temporary close registration
    /*
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/signup',
        failureFlash: true // allow flash messages
    }));
    */

    // --- Profile ---

    app.get('/profile', isLoggedIn, function (req, res) {
        res.render(
            'profile.ejs',
            {
                user: req.user
            }
        );
    });

    // --- Subscribe ---

    app.get(
        '/subscribe',
        function (req, res) {
            res.render(
                'landing-page.ejs'
            );
        }
    );

    app.post(
        '/subscribe',
        function (req, res, next) {
            var email = req.body.email;

            subscriberController.add(
                email,
                function (err, result) {
                    if (err) {
                        res.send(500);
                    }

                    res.send(result);
                }
            );
        }
    );

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
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
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

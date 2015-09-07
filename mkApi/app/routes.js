var dashboardController = require('./controllers/dashboard');
var categoryController = require('./controllers/category');
var currencyController = require('./controllers/currency');
var accountController = require('./controllers/account');
var transactionController = require('./controllers/transaction');


module.exports = function (app, passport, router) {

    // =================================================================================================================
    // === App page ====================================================================================================
    // =================================================================================================================
    app.get('/', isLoggedIn, function (req, res) {
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
       res.render(
            'signup.ejs',
            {
                message: req.flash('signupMessage')
            }
        );
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/signup',
        failureFlash: true // allow flash messages
    }));

    // GOOGLE ROUTES
    app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/',
            failureRedirect: '/login'
        }));

    // VK ROUTES
    app.get('/auth/vk', passport.authenticate('vkontakte', {scope: ['profile', 'email']}));
    app.get('/auth/vk/callback',
        passport.authenticate('vkontakte', {
            successRedirect: '/',
            failureRedirect: '/login'
        }));

    // FACEBOOK ROUTES
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/',
            failureRedirect : '/login'
        }));

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

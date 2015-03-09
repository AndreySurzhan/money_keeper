var Category = require('./models/category');
var CategoryController = require('./controllers/category');
var CurrencyController = require('./controllers/currency');
var AccountController = require('./controllers/account');
var TransactionController = require('./controllers/transaction');


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

    // =====================================
    // CATEGORIES ==========================
    // =====================================
    // middleware to use for all requests
    router.use(function (req, res, next) {
        // do logging
        console.log('Something is happening.');
        next(); // make sure we go to the next routes and don't stop here
    });

    // test route to make sure everything is working (accessed at GET http://localhost:8080/api)
    router.get('/', function (req, res) {
        res.json({message: 'hooray! welcome to our api!'});
    });

    // more routes for our API will happen here

    // on routes that end in /categories
    // ----------------------------------------------------
    router.route('/categories')
        .get(isAuthorized, function (req, res) {
            CategoryController.getAll(
                req.user,
                function (err, categories) {
                    if (err) {
                        sendError(err, res);

                        return;
                    }

                    res.json(categories);
                }
            );
        })
        .post(isAuthorized, function (req, res) {
            console.log('call route POST: /categories');
            CategoryController.post(
                req.user,
                {
                    name: req.body.name,
                    parent: req.body.parent,
                    income: req.body.income
                },
                function (err, category) {
                    if (err) {
                        sendError(err, res);

                        return;
                    }

                    res.json(category);
                }
            );
        });

    router.route('/categories/income')
        .get(isAuthorized, function (req, res) {
            CategoryController.getIncome(
                req.user,
                function (err, categories) {
                    if (err) {
                        sendError(err, res);

                        return;
                    }

                    res.json(categories);
                }
            );
        });

    router.route('/categories/outcome')
        .get(isAuthorized, function (req, res) {
            CategoryController.getOutcome(
                req.user,
                function (err, categories) {
                    if (err) {
                        sendError(err, res);

                        return;
                    }

                    res.json(categories);
                }
            );
        });

    router.route('/categories/:category_id')
        .get(isAuthorized, function (req, res) {
            CategoryController.getById(
                req.user,
                req.params.category_id,
                function (err, category) {
                    if (err) {
                        sendError(err, res);

                        return;
                    }

                    res.json(category);
                }
            );
        })
        .put(isAuthorized, function (req, res) {
            CategoryController.update(
                req.user,
                req.params.category_id,
                {
                    name: req.body.name,
                    parent: req.body.parent
                },
                function (err, category) {
                    if (err) {
                        sendError(err, res);

                        return;
                    }

                    res.json(category);
                }
            );
        })
        .delete(isAuthorized, function (req, res) {
            CategoryController.remove(
                req.user,
                req.params.category_id,
                function (err, category) {
                    if (err) {
                        sendError(err, res);

                        return;
                    }

                    res.json(category);
                }
            );
        });

    router.route('/currencies')
        .get(isAuthorized, function (req, res) {
            CurrencyController.getAll(
                req.user,
                function (err, currencies) {
                    if (err) {
                        sendError(err, res);

                        return;
                    }

                    res.json(currencies);
                }
            );
        })
        .post(isAuthorized, function (req, res) {
            CurrencyController.post(
                req.user,
                {
                    name: req.body.name
                },
                function (err, currency) {
                    if (err) {
                        sendError(err, res);

                        return;
                    }

                    res.json(currency);
                }
            );
        });

    router.route('/currencies/:currency_id')
        .get(isAuthorized, function (req, res) {
            CurrencyController.getById(
                req.user,
                req.params.currency_id,
                function (err, currency) {
                    if (err) {
                        sendError(err, res);

                        return;
                    }

                    res.json(currency);
                }
            );
        })
        .put(isAuthorized, function (req, res) {
            CurrencyController.update(
                req.user,
                req.params.currency_id,
                {
                    name: req.body.name
                },
                function (err, currency) {
                    if (err) {
                        sendError(err, res);

                        return;
                    }

                    res.json(currency);
                }
            );
        })
        .delete(isAuthorized, function (req, res) {
            CurrencyController.remove(
                req.user,
                req.params.currency_id,
                function (err, currency) {
                    if (err) {
                        sendError(err, res);

                        return;
                    }

                    res.json(currency);
                }
            );
        });
    // --

    router.route('/accounts')
        .get(isAuthorized, function (req, res) {
            AccountController.getAll(
                req.user,
                function (err, accounts) {
                    if (err) {
                        sendError(err, res);

                        return;
                    }

                    res.json(accounts);
                }
            );
        })
        .post(isAuthorized, function (req, res) {
            AccountController.post(
                req.user,
                {
                    name: req.body.name,
                    initValue: req.body.initValue,
                    currency: req.body.currency
                },
                function (err, currency) {
                    if (err) {
                        sendError(err, res);

                        return;
                    }

                    res.json(currency);
                }
            );
        });

    router.route('/accounts/:accounts_id')
        .get(isAuthorized, function (req, res) {
            AccountController.getById(
                req.user,
                req.params.accounts_id,
                function (err, account) {
                    if (err) {
                        sendError(err, res);

                        return;
                    }

                    res.json(account);
                }
            );
        })
        .put(isAuthorized, function (req, res) {
            AccountController.update(
                req.user,
                req.params.accounts_id,
                {
                    name: req.body.name,
                    initValue: req.body.initValue,
                    currency: req.body.currency
                },
                function (err, account) {
                    if (err) {
                        sendError(err, res);

                        return;
                    }

                    res.json(account);
                }
            );
        })
        .delete(isAuthorized, function (req, res) {
            AccountController.remove(
                req.user,
                req.params.accounts_id,
                function (err, account) {
                    if (err) {
                        sendError(err, res);

                        return;
                    }

                    res.json(account);
                }
            );
        });
    router.route('/transactions')
        .get(isAuthorized, function (req, res) {
            TransactionController.getAll(
                req.user,
                function (err, transactions) {
                    if (err) {
                        sendError(err, res);

                        return;
                    }

                    res.json(transactions);
                }
            );
        })
        .post(isAuthorized, function (req, res) {
            TransactionController.post(
                req.user,
                {
                    date: req.body.date,
                    category: req.body.category,
                    value: req.body.value,
                    account: req.body.account,
                    note: req.body.note
                },
                function (err, transaction) {
                    if (err) {
                        sendError(err, res);

                        return;
                    }

                    res.json(transaction);
                }
            );
        });

    router.route('/transactions/:transaction_id')
        .get(isAuthorized, function (req, res) {
            TransactionController.getById(
                req.user,
                req.params.transaction_id,
                function (err, transaction) {
                    if (err) {
                        sendError(err, res);

                        return;
                    }

                    res.json(transaction);
                }
            );
        })
        .put(isAuthorized, function (req, res) {
            TransactionController.update(
                req.user,
                req.params.transaction_id,
                {
                    date: req.body.date,
                    category: req.body.category,
                    value: req.body.value,
                    account: req.body.account,
                    note: req.body.note
                },
                function (err, transaction) {
                    if (err) {
                        sendError(err, res);

                        return;
                    }

                    res.json(transaction);
                }
            );
        })
        .delete(isAuthorized, function (req, res) {
            TransactionController.remove(
                req.user,
                req.params.transaction_id,
                function (err, transaction) {
                    if (err) {
                        sendError(err, res);

                        return;
                    }

                    res.json(transaction);
                }
            );
        });


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
    app.use('/api', router);
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    console.log('check isLoggedIn')

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        console.log('logged in');

        return next();
    }

    console.log('NOT logged in. Redirect');
    // if they aren't redirect them to the home page
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

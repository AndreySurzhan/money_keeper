var Account = require('../models/account');
var dashboardRoutes = require('./dashboard_routes');

var dashboardController = {
    getData: function (user, callback) {
        /*
        callback(
            null,
            {
                total: {
                    value: 100,
                    currency: '$'
                }
            }
        );
        */

        Account.find(
            {
                _owner: user._id
            })
            .populate('currency')
            .exec(function (err, accounts) {
                var total = {
                    value: 0
                };

                if (err) {
                    callback(err);

                    return;
                }

                if (!accounts.length) {
                    callback(
                        null,
                        {
                            total: 0
                        }
                    );

                    return;
                }

                total.currency = accounts[0].currency.name;

                for (var i = 0; i < accounts.length; i++) {
                    total.value += accounts[i].value;
                }

                callback(
                    null,
                    {
                        total: total
                    }
                );
            });
    },
    registerRoutes: function (router, isAuthorized, sendError) {
        dashboardRoutes(router, this, isAuthorized, sendError);
    }
};

module.exports = dashboardController;

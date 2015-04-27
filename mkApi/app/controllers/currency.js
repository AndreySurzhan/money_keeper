var Currency = require('../models/currency');
var currencyRoutes = require('./currency_routes');
var currencyController = {
    getAll: function (user, callback) {
        Currency.find(
            {
                _owner: user._id
            })
            .exec(callback);
    },
    getById: function (user, id, callback) {
        Currency.findOne({
            _id: id,
            _owner: user._id
        })
            .exec(callback);
    },
    post: function (user, data, callback) {
        var currency = new Currency();

        currency._owner = user._id;
        currency.name = data.name;
        currency.save(callback);
    },
    update: function (user, id, data, callback) {
        Currency.findById(
            id,
            {
                _owner: user._id
            },
            function (err, currency) {
                if (err) {
                    callback(err);

                    return;
                }

                currency.name = data.name;
                currency.save(callback);
            }
        );
    },
    remove: function (user, id, callback) {
        Currency.remove(
            {
                _id: id,
                _owner: user._id
            },
            function (err, result) {
                if (err) {
                    callback(err);

                    return;
                }

                Currency.find(
                    {
                        _owner: user._id
                    })
                    .exec(callback);
            }
        );
    },
    registerRoutes: function (router, isAuthorized, sendError) {
        currencyRoutes(router, this, isAuthorized, sendError);
    }
};

module.exports = currencyController;

var _ = require('underscore');
var Q = require('q');

var Currency = require('../models/currency');
var User = require('../models/user');

var currencyRoutes = require('./currency_routes');
var currencyController = {
    getAll: function (user) {
        var deferred = Q.defer();

        Currency.find(
            {
                _owner: user._id
            })
            .exec(function (error, currencies) {
                if (error) {
                    deferred.reject(error);
                    return;
                }

                deferred.resolve(currencies);
            });

        return deferred.promise;
    },
    getById: function (user, id, callback) {
        Currency.findOne({
            _id: id,
            _owner: user._id
        })
            .exec(callback);
    },
    post: function (user, globalCurrencyId) {
        var currency;
        var deferred = Q.defer();

        this.getGlobalById(globalCurrencyId)
            .then(function (globalCurrency) {
                if (!globalCurrency) {
                    deferred.reject({
                        message: 'Global currency with id="' + globalCurrencyId + '" does not exist.'
                    });
                    return;
                }

                console.log('globalCurrency', globalCurrency);

                currency = new Currency();
                _.extend(currency, {
                    _owner: user._id,
                    name: globalCurrency.name,
                    icon: globalCurrency.icon
                });

                currency.save(function (error, newCurrency) {
                    if (error) {
                        deferred.reject(error);
                        return;
                    }

                    console.log('currency saved', newCurrency)

                    deferred.resolve(newCurrency);
                });
            })
            .fail(function (error) {
                deferred.reject(error);
            });

        return deferred.promise;
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
    getGlobals: function () {
        var deferred = Q.defer();

        Currency.find(
            {
                _owner: 0
            })
            .exec(function (error, globalCurrencies) {
                if (error) {
                    deferred.reject(error);
                    return;
                }

                deferred.resolve(globalCurrencies);
            });

        return deferred.promise;
    },
    getGlobalById: function (id) {
        var deferred = Q.defer();

        console.log('getGlobalById', id);

        Currency.findOne({
            _id: id,
            _owner: 0
        })
            .exec(function (error, currency) {
                if (error) {
                    deferred.reject(error);
                    return;
                }

                deferred.resolve(currency);
            });

        return deferred.promise;
    },
    addGlobal: function (currencyData) {
        var currency = new Currency();
        var deferred = Q.defer();

        _.extend(currency, currencyData, {
            _owner: 0,
            global: 0
        });

        currency.save(function (error, newCurrency) {
            if (error) {
                deferred.reject(error);
                return;
            }

            deferred.resolve(newCurrency);
        });

        return deferred.promise;
    },
    registerRoutes: function (router, isAuthorized, sendError) {
        currencyRoutes(router, this, isAuthorized, sendError);
    }
};

module.exports = currencyController;

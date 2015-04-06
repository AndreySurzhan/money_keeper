var Account = require('../models/account');
var accountRoutes = require('./account_routes');
var accountController = {
    getAll: function (user, callback) {
        Account.find(
            {
                _owner: user._id
            })
            .populate('currency')
            .exec(callback);
    },
    getById: function (user, id, callback) {
        Account.findOne({
            _id: id,
            _owner: user._id
        })
            .populate('currency')
            .exec(callback);
    },
    post: function (user, data, callback) {
        var account = new Account();

        data.initValue = data.initValue || 0;
        data.currency = data.currency || null;

        account._owner = user._id;
        account.name = data.name;
        account.value = data.initValue;
        account.initValue = data.initValue;
        account.currency = data.currency;

        account.save(callback);
    },
    update: function (user, id, data, callback) {
        Account.findById(
            id,
            {
                _owner: user._id
            },
            function (err, account) {
                if (err) {
                    callback(err);

                    return;
                }

                account.name = data.name;
                account.value = data.initValue;
                account.initValue = data.initValue;
                account.currency = data.currency;
                account.save(callback);
            }
        );
    },
    remove: function (user, id, callback) {
        Account.remove(
            {
                _id: id,
                _owner: user._id
            },
            function (err, result) {
                if (err) {
                    callback(err);

                    return;
                }

                Account.find(
                    {
                        _owner: user._id
                    })
                    .populate('currency')
                    .exec(callback);
            }
        );
    },
    registerRoutes: function (router, isAuthorized) {
        accountRoutes(router, this, isAuthorized);
    }
};

module.exports = accountController;

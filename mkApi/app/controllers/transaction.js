var Transaction = require('../models/transaction');
var Account = require('../models/account');
var Category = require('../models/category');

var TransactionController = {
    getAll: function (user, callback) {
        Transaction.find(
            {
                _owner: user._id
            })
            .populate('category')
            .populate('account')
            .exec(callback);
    },
    getById: function (user, id, callback) {
        Transaction.findOne({
            _id: id,
            _owner: user._id
        })
            .populate('category')
            .populate('account')
            .exec(callback);
    },
    post: function (user, data, callback) {
        var transaction = new Transaction();

        transaction._owner = user._id;
        transaction.date = data.date;
        transaction.category = data.category;
        transaction.value = data.value;
        transaction.account = data.account;
        transaction.note = data.note;

        console.log('Getting account ' + transaction.account);
        Account.findOne({
            _id: transaction.account,
            _owner: user._id
        })
            .exec(function (err, account) {
                if (!account || err) {
                    err = err || {
                        status: 404,
                        message: 'Account with id=' + transaction.account + ' was not found'
                    };

                    console.error(err);
                    callback(err);
                    return;
                }

                console.log(account);
                console.log('Getting category ' + transaction.category);

                Category.findOne({
                    _id: transaction.category,
                    _owner: user._id
                })
                    .exec(function (err, category) {
                        if (!category || err) {
                            err = err || {
                                status: 404,
                                message: 'Category with id=' + transaction.category + ' was not found'
                            };

                            console.error(err);
                            callback(err);
                            return;
                        }

                        console.log(category);

                        transaction.save(callback);
                        account.value += transaction.value * (category.income ? 1 : -1);
                        account.save();
                    });

            });
    },
    update: function (user, id, data, callback) {
        Transaction.findById(
            id,
            {
                _owner: user._id
            },
            function (err, transaction) {
                if (err) {
                    callback(err);

                    return;
                }

                callback({
                    status: 501,
                    message: 'Updating is not implemented yet'
                }); return;

                transaction.date = data.date;
                transaction.category = data.category;
                transaction.value = data.value;
                transaction.account = data.account;
                transaction.note = data.note;

                transaction.save(callback);
            }
        );
    },
    remove: function (user, id, callback) {
        var that = this;

        Transaction.remove(
            {
                _id: id,
                _owner: user._id
            },
            function (err, result) {
                if (err) {
                    callback(err);

                    return;
                }

                that.getAll(user, callback);
            }
        );
    }
};

module.exports = TransactionController;

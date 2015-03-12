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
            .populate('accountSource')
            .populate('accountDestination')
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
        transaction.type = data.type;
        transaction.accountSource = data.accountSource;
        transaction.accountDestination = data.accountDestination;
        transaction.note = data.note;

        console.log('Getting account ' + transaction.accountSource);
        Account.findOne({
            _id: transaction.accountSource,
            _owner: user._id
        })
            .exec(function (err, accountSource) {
                if (!accountSource || err) {
                    err = err || {
                        status: 404,
                        message: 'Source account with id=' + transaction.accountSource + ' was not found.'
                    };

                    console.error(err);
                    callback(err);
                    return;
                }

                accountSource.value += transaction.value * (transaction.type === 'income' ? 1 : -1);
                accountSource.save();

                if (transaction.type === 'transfer') {
                    Account.findOne({
                        _id: transaction.accountDestination,
                        _owner: user._id
                    })
                        .exec(function (err, accountDestination) {
                            if (!accountDestination || err) {
                                err = err || {
                                    status: 404,
                                    message: 'Destination account with id=' + transaction.accountDestination + ' was not found.'
                                };

                                console.error(err);
                                callback(err);
                                return;
                            }

                            accountDestination.value += transaction.value;
                            accountDestination.save();

                            transaction.save(callback);
                        });
                } else {
                    transaction.save(callback);
                }
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
                transaction.type = data.type;
                transaction.accountSource = data.accountSource;
                transaction.accountDestination = data.accountDestination;
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

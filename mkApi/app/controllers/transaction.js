var Account = require('../models/account');
var Category = require('../models/category');
var Transaction = require('../models/transaction');
var transactionRoutes = require('./transaction_routes');
var TransactionsImporter = require('./transactionsImporter/importer');

var transactionController = {
    getAll: function (user, pagination, callback) {
        pagination = pagination || {};
        pagination.page = pagination.page || 1;
        pagination.perPage = pagination.perPage || 10;

        Transaction.paginate(
            {
                _owner: user._id
            },
            pagination.page,
            pagination.perPage,
            function (error, pageCount, paginatedResults, totalItems) {
                console.log('pagination result');
                console.log('page: ', pagination.page);
                console.log('perPage: ', pagination.perPage);
                console.log('pageCount: ', pageCount);
                console.log('totalItems: ', totalItems);

                callback(error, paginatedResults, totalItems);
            },
            {
                populate: ['category', 'accountSource', 'accountDestination']
                //sortBy: {title: -1}
            }
        );
    },
    getById: function (user, id, callback) {
        Transaction.findOne({
            _id: id,
            _owner: user._id
        })
            .populate('category')
            .populate('accountSource')
            .populate('accountDestination')
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

                if (transaction.type !== 'transfer') {
                    accountSource.value += transaction.value * (transaction.type === 'income' ? 1 : -1);

                    accountSource.save(function (err) {
                        if (err) {
                            console.error(err);
                            callback(err);
                        }
                        transaction.save(callback);
                    });
                } else {
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

                            accountSource.value -= transaction.value;
                            accountDestination.value += transaction.value;

                            accountSource.save(function (err) {
                                if (err) {
                                    console.error(err);
                                    callback(err);
                                }
                                accountDestination.save(function (err) {
                                    if (err) {
                                        console.error(err);
                                        callback(err);
                                    }
                                    transaction.save(callback);
                                });
                            });
                        });
                }
            });
    },
    update: function (user, id, data, callback) {
        Transaction.findOne(
            {
                _id: id,
                _owner: user._id
            },
            function (err, transaction) {
                if (err) {
                    callback(err);

                    return;
                }

                var oldType = transaction.type;
                var oldValue = transaction.value;

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

                        if (transaction.type !== 'transfer') {

                            accountSource.value -= oldValue * (oldType === 'income' ? 1 : -1);
                            accountSource.value += transaction.value * (transaction.type === 'income' ? 1 : -1);

                            accountSource.save(function (err) {
                                if (err) {
                                    console.error(err);
                                    callback(err);
                                }
                                transaction.save(callback);
                            });
                        } else {
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

                                    accountSource.value -= oldValue * (oldType === 'income' ? 1 : -1);
                                    accountSource.value += transaction.value * (transaction.type === 'income' ? 1 : -1);

                                    accountDestination.value += oldValue * (oldType === 'income' ? 1 : -1);
                                    accountDestination.value -= transaction.value * (transaction.type === 'income' ? 1 : -1);

                                    accountSource.save(function (err) {
                                        if (err) {
                                            console.error(err);
                                            callback(err);
                                        }
                                        accountDestination.save(function (err) {
                                            if (err) {
                                                console.error(err);
                                                callback(err);
                                            }
                                            transaction.save(callback);
                                        });
                                    });
                                });
                        }
                    });

                // transaction.save(callback);
            }
        );
    },
    remove: function (user, id, callback) {
        var that = this;

        Transaction.findOne(
            {
                _id: id,
                _owner: user._id
            },
            function (err, transaction) {
                if (!transaction || err) {
                    err = err || {
                        status: 404,
                        message: 'Transaction with id=' + id + ' was not found.'
                    };
                    console.error(err);
                    callback(err);

                    return;
                }

                Account.findOne(
                    {
                        _id: transaction.accountSource,
                        _owner: user._id
                    },
                    function (err, accountSource) {
                        if (!accountSource || err) {
                            err = err || {
                                status: 404,
                                message: 'Source account with id=' + transaction.accountSource + ' was not found.'
                            };
                            console.error(err);
                            callback(err);

                            return;
                        }

                        if (transaction.type !== 'transfer') {
                            accountSource.value -= transaction.value * (transaction.type === 'income' ? 1 : -1);

                            accountSource.save(function (err) {
                                if (err) {
                                    console.error(err);
                                    callback(err);
                                }
                                Transaction.remove(
                                    {
                                        _id: id,
                                        _owner: user._id
                                    },
                                    function (err) {
                                        if (err) {
                                            callback(err);
                                            return;
                                        }

                                        Transaction.find(
                                            {
                                                _owner: user._id
                                            })
                                            .populate('category')
                                            .populate('accountSource')
                                            .populate('accountDestination')
                                            .exec(callback);
                                    }
                                );
                            });
                        } else {
                            Account.findOne(
                                {
                                    _id: transaction.accountDestination,
                                    _owner: user._id
                                },
                                function (err, accountDestination) {
                                    if (!accountDestination || err) {
                                        err = err || {
                                            status: 404,
                                            message: 'Destination account with id=' + transaction.accountDestination + ' was not found.'
                                        };
                                        console.error(err);
                                        callback(err);

                                        return;
                                    }

                                    accountSource.value += transaction.value;
                                    accountDestination.value -= transaction.value;

                                    accountSource.save(function (err) {
                                        if (err) {
                                            console.error(err);
                                            callback(err);
                                        }
                                        accountDestination.save(function (err) {
                                            if (err) {
                                                console.error(err);
                                                callback(err);
                                            }
                                            Transaction.remove(
                                                {
                                                    _id: id,
                                                    _owner: user._id
                                                },
                                                function (err) {
                                                    if (err) {
                                                        callback(err);
                                                        return;
                                                    }

                                                    Transaction.find(
                                                        {
                                                            _owner: user._id
                                                        })
                                                        .populate('category')
                                                        .populate('accountSource')
                                                        .populate('accountDestination')
                                                        .exec(callback);
                                                }
                                            );
                                        });
                                    });
                                }
                            );
                        }
                    }
                );
            }
        );
    },

    uploadFile: function (req, res) {
        var file;
        var importer;
        var source;

        source = req.body.source;
        file = req.files.file;
        importer = new TransactionsImporter(source, file.path);

        importer.getMappingData(
            function (data) {
                res.json(data);
            },
            function (error) {
                console.log(error);
            }
        );
    },

    registerRoutes: function (router, isAuthorized, sendError) {
        transactionRoutes(router, this, isAuthorized, sendError);
    }
};

module.exports = transactionController;


var charsets = [
    'ASCII',
    'ISO-8859-1',
    'ISO-8859-2',
    'ISO-8859-3',
    'ISO-8859-4',
    'ISO-8859-5',
    'ISO-8859-7',
    'ISO-8859-9',
    'ISO-8859-10',
    'ISO-8859-13',
    'ISO-8859-14',
    'ISO-8859-15',
    'ISO-8859-16',
    'KOI8-R',
    'KOI8-U',
    'KOI8-RU',
    'CP437',
    'CPCP737',
    'CP775',
    'CP850',
    'CP852',
    'CP853',
    'CP855',
    'CP857',
    'CP858',
    'CP860',
    'CP861',
    'CP863',
    'CP865',
    'CP866',
    'CP869',
    'CP1125',
    'CP1250',
    'CP1251',
    'CP1252',
    'CP1253',
    'CP1254',
    'CP1257',
    'Mac Roman',
    'MacCentralEurope',
    'MacIceland',
    'MacCroatian',
    'MacRomania',
    'Mac',
    'MacCyrillic',
    'MacUkraine',
    'MacGreek',
    'MacTurkish',
    'Macintosh',
    'ISO-8859-6',
    'ISO-8859-8',
    'CP1255',
    'CP1256',
    'CP862',
    'CP864',
    'MacHebrew',
    'MacArabic',
    'UTF-8',
    'UCS-2',
    'UCS-2BE',
    'UCS-2LE',
    'UCS-4',
    'UCS-4BE',
    'UCS-4LE',
    'UTF-16',
    'UTF-16BE',
    'UTF-16LE',
    'UTF-32',
    'UTF-32BE',
    'UTF-32LE',
    'UTF-7',
    'C99',
    'JAVA'
];

/*
 console.log('firstWord', firstWord);


 for (var i = 0; i < charsets.length; i++) {
 for (var j = 0; j < charsets.length; j++) {
 if (i !== j) {
 try {
 var conv = new Iconv(charsets[i], charsets[j]);

 console.log(conv.convert(firstWord).toString());
 } catch (e) {

 }
 }
 }
 }
 */
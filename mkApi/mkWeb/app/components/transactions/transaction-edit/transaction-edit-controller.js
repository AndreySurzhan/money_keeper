define(
    [
        'mkControllers',
        'json!enums',
        'json!config',
        'underscore',
        'jquery',
        'logger',
        'scopeUtil',
        'entityUtil',
        'formUtil',
        '../transactions-services',
        '../../currencies/currencies-services'
    ],
    function (mkControllers, enums, config, _, $, logger, scopeUtil, entityUtil, formUtil) {
        var controllerName = 'TransactionEditCtrl';

        // Accounts
        var storedAccounts;
        var getAccounts = function (accountsFactory) {
            var result = new $.Deferred();

            if (storedAccounts) {
                logger.log('Return stored accounts');
                result.resolve(storedAccounts);
                return result.promise();
            }

            logger.groupCollapsed('Getting accounts');
            logger.time('Getting accounts');
            accountsFactory.query(
                function (accounts) {
                    logger.timeEnd('Getting accounts');
                    logger.logAccounts(accounts);
                    logger.groupEnd('Getting accounts');

                    storedAccounts = accounts;
                    result.resolve(storedAccounts)
                },
                function (error) {
                    logger.timeEnd('Getting accounts');
                    logger.groupEnd('Getting accounts');
                    logger.error(error);

                    result.reject(error);
                }
            );

            return result.promise();
        };

        // Categories
        var storedIncomeCategories;
        var getIncomeCategories = function (Category) {
            var result = $.Deferred();

            if (storedIncomeCategories) {
                logger.log('Return stored income categories');
                result.resolve(storedIncomeCategories);
                return result.promise();
            }

            logger.groupCollapsed('Getting income categories');
            logger.time('Getting income categories');
            Category.getIncome(
                function (categories) {
                    logger.timeEnd('Getting income categories');
                    logger.logCategories(categories);
                    logger.groupEnd('Getting income categories');

                    storedIncomeCategories = categories;
                    result.resolve(storedIncomeCategories)
                },
                function (error) {
                    logger.timeEnd('Getting income categories');
                    logger.groupEnd('Getting income categories');
                    logger.error(error);

                    result.reject(error);
                }
            );

            return result.promise();
        };
        var storedOutcomeCategories;
        var getOutcomeCategories = function (Category) {
            var result = new $.Deferred();

            if (storedOutcomeCategories) {
                logger.log('Return stored outcome categories');
                result.resolve(storedOutcomeCategories);
                return result.promise();
            }

            logger.groupCollapsed('Getting outcome categories');
            logger.time('Getting outcome categories');
            Category.getOutcome(
                function (categories) {
                    logger.timeEnd('Getting outcome categories');
                    logger.logCategories(categories);
                    logger.groupEnd('Getting outcome categories');

                    storedOutcomeCategories = categories;
                    result.resolve(storedOutcomeCategories);
                },
                function (error) {
                    logger.timeEnd('Getting outcome categories');
                    logger.groupEnd('Getting outcome categories');
                    logger.error(error);

                    result.reject(error);
                }
            );

            return result.promise();
        };
        var getEmptyCategorieslist = function () {
            var result = new $.Deferred();

            result.resolve([]);

            return result.promise();
        };

        // Transactions
        var getEmptyTransactionData = function () {
            var dateNow = new Date();
            var result = new $.Deferred();

            logger.log('Creating empty transaction');

            result.resolve({
                category: 0,
                date: dateNow.toLocaleDateString(config.lang),
                type: enums.transactionTypes.outcome.value,
                accountSource: 0,
                accountDestination: 0,
                value: null,
                note: ''
            });

            return result.promise();
        };
        var getTransactionDataById = function (id, transactionsFactory) {
            var result = new $.Deferred();
            var transactionDate;

            logger.groupCollapsed('Getting transaction  #' + id);
            logger.time('Getting transaction #' + id);
            transactionsFactory.get(
                {
                    id: id
                },
                function (transaction) {
                    logger.timeEnd('Getting transaction #' + id);
                    logger.groupEnd('Getting transaction  #' + id);

                    transactionDate = new Date(transaction.date);
                    transaction.date = transactionDate.toLocaleDateString(config.lang);

                    result.resolve(transaction);
                },
                function (error) {
                    logger.timeEnd('Getting transaction #' + id);
                    logger.groupEnd('Getting transaction  #' + id);

                    result.reject(error);
                }
            );

            return result.promise();
        };
        var initTransactionForm = function (transaction, $scope, $filter, Account, Category) {
            var result = new $.Deferred();
            var accounts;
            var categories;
            var transactionType;
            var transactionTypes;

            accounts = getAccounts(Account);
            transactionType = _.isObject(transaction.type)
                ? transaction.type.value
                : transaction.type;
            transactionTypes = getTransactionTypes(enums, $filter);
            switch (transactionType) {
                case enums.transactionTypes.income.value:
                    categories = getIncomeCategories(Category);
                    break;
                case enums.transactionTypes.outcome.value:
                    categories = getOutcomeCategories(Category);
                    break;
                default:
                    categories = getEmptyCategorieslist();
            }

            $.when(accounts, categories, transactionTypes)
                .done(function (accountsList, categoriesList, transactionTypesList) {
                    var transactionType = _.isObject(transaction.type)
                        ? transaction.type.value
                        : transaction.type;

                    entityUtil.normalizeEntityField(transaction, 'accountSource', '_id', accountsList);
                    entityUtil.normalizeEntityField(transaction, 'accountDestination', '_id', accountsList);
                    entityUtil.normalizeEntityField(transaction, 'category', '_id', categoriesList);
                    entityUtil.normalizeEntityField(transaction, 'type', 'value', transactionTypesList);

                    if (transactionType === enums.transactionTypes.transfer.value) {
                        formUtil.initControl($scope, 'accountDestination', {
                            data: accountsList
                        });
                        formUtil.hideAndDisableControl($scope, 'category');
                    } else {
                        formUtil.initControl($scope, 'category', {
                            data: categoriesList
                        });
                        formUtil.hideAndDisableControl($scope, 'accountDestination');
                    }

                    formUtil.initControl($scope, 'value');
                    formUtil.initControl($scope, 'date');
                    formUtil.initControl($scope, 'transactionTypes', {
                        data: transactionTypesList
                    });
                    formUtil.initControl($scope, 'accountSource', {
                        data: accountsList
                    });
                    formUtil.initControl($scope, 'note');

                    formUtil.initControl($scope, 'submit');

                    result.resolve(transaction);
                })
                .fail(function (error) {
                    result.reject(error);
                });

            return result.promise();
        };
        var getPreparedData = function (data) {
            var attributesMap = {
                value: function (value) {
                    return value;
                },
                date: function (dateStr) {
                    var date;
                    var result;
                    var temp;

                    switch (config.plugins.datedropper.format) {
                        case 'd.m.Y':
                            temp = dateStr.split('.');
                            date = new Date(temp[2], temp[1] - 1, temp[0]);
                            result = date.toString();
                            break;
                        default:
                            logger.error('Unknown date format');
                            result = null;
                    }

                    return result;
                },
                type: function (type) {
                    if (_.isObject(type)) {
                        return type.value;
                    } else {
                        return type;
                    }
                },
                accountSource: function (accountSource) {
                    var accountId;

                    if (_.isObject(accountSource)) {
                        accountId = accountSource._id;
                    } else {
                        accountId = accountSource;
                    }

                    accountId = accountId === 0 ? null : accountId;

                    return accountId;
                },
                accountDestination: function (accountDestination) {
                    var accountId;

                    if (_.isObject(accountDestination)) {
                        accountId = accountDestination._id;
                    } else {
                        accountId = accountDestination;
                    }

                    accountId = accountId === 0 ? null : accountId;

                    return accountId;
                },
                category: function (category) {
                    var categoryId;

                    if (_.isObject(category)) {
                        categoryId = category._id;
                    } else {
                        categoryId = category;
                    }

                    categoryId = categoryId === 0 ? null : categoryId;

                    return categoryId;
                },
                note: function (note) {
                    return note;
                }
            };
            var preparedData = {};

            for (var attribute in attributesMap) {
                if (!attributesMap.hasOwnProperty(attribute)) {
                    return;
                }

                preparedData[attribute] = attributesMap[attribute](data[attribute]);
            }

            return preparedData;
        };
        var createTransaction = function (id, model, transactionFactory) {
            var preparedData;
            var result = new $.Deferred();

            preparedData = getPreparedData(model);

            transactionFactory.save(
                preparedData,
                function (transaction) {
                    result.resolve(transaction);
                },
                function (error) {
                    result.reject(error);
                }
            );

            return result.promise();
        };
        var saveTransaction = function (id, model, transactionFactory) {
            var preparedData;
            var result = new $.Deferred();

            preparedData = getPreparedData(model);

            transactionFactory.update(
                {
                    id: id
                },
                preparedData,
                function (transaction) {
                    result.resolve(transaction);
                },
                function (error) {
                    result.reject(error);
                }
            );

            return result.promise();
        };

        // Transaction types
        var getTransactionTypes = function (enums, $filter) {
            var result = new $.Deferred();
            var types = [];

            logger.groupCollapsed('Get transaction types');

            for (var key in enums.transactionTypes) {
                types.push({
                    name: $filter('translate')(enums.transactionTypes[key].name),
                    value: enums.transactionTypes[key].value
                });
            }

            logger.table(types);
            logger.groupEnd('Get transaction types');

            result.resolve(types);

            return result.promise();
        };

        // Form state
        var setInitialFormState = function ($scope) {
            $scope.formState = {
                value: {
                    enable: false
                },
                date: {
                    enable: false
                },
                accountSource: {
                    data: [],
                    enable: false,
                    visible: true
                },
                accountDestination: {
                    data: [],
                    enable: false,
                    visible: false
                },
                category: {
                    data: [],
                    enable: false,
                    visible: true
                },
                transactionTypes: {
                    data: [],
                    enable: false
                },
                note: {
                    enable: false
                },
                submit: {
                    enable: false
                },
                texts: {
                    header: 'header',
                    saveButton: 'save button'
                }
            };
        };
        var setCreateTransactionTexts = function ($scope, $filter) {
            $scope.formState.texts.header = $filter('translate')('components.transactions.create.header');
            $scope.formState.texts.saveButton = $filter('translate')('common.buttons.create');

        };
        var setEditTransactionTexts = function ($scope, $filter) {
            $scope.formState.texts.header = $filter('translate')('components.transactions.edit.header');
            $scope.formState.texts.saveButton = $filter('translate')('common.buttons.save');
        };

        mkControllers.controller(
            controllerName,
            [
                '$scope',
                '$filter',
                '$modalInstance',
                'Analytics',
                'Transaction',
                'Category',
                'Account',
                'transactionId',
                function ($scope, $filter, $modalInstance, Analytics, Transaction, Category, Account, transactionId) {
                    logger.info('--- Edit Transaction controller initialize ---');
                    logger.time('Edit Transaction controller initialize');

                    Analytics.trackEvent('transaction', 'edit', transactionId);

                    var transactionOperationType;
                    var transactionPromise;

                    $scope.id = transactionId;
                    setInitialFormState($scope);

                    if ($scope.id === 'add') {
                        transactionOperationType = 'create';
                        setCreateTransactionTexts($scope, $filter);
                        transactionPromise = getEmptyTransactionData();
                    } else {
                        transactionOperationType = 'edit';
                        setEditTransactionTexts($scope, $filter);
                        transactionPromise = getTransactionDataById($scope.id, Transaction);
                    }

                    transactionPromise.done(function (transaction) {
                        initTransactionForm(transaction, $scope, $filter, Account, Category)
                            .done(function (transaction) {
                                $scope.model = transaction;
                                scopeUtil.applySafely($scope);
                                logger.timeEnd('Edit Transaction controller initialize');
                            })
                            .fail(function (error) {
                                logger.timeEnd('Edit Transaction controller initialize');
                                logger.error(error);
                            });
                    });

                    // Events

                    $scope.transactionTypeChangedHandler = function () {
                        initTransactionForm($scope.model, $scope, $filter, Account, Category)
                            .done(function (transaction) {
                                $scope.model = transaction;
                            })
                            .fail(function (error) {
                                logger.error(error);
                            });
                    };

                    $scope.executeOperation = function () {
                        var operation;

                        formUtil.validateForm($scope.transactionForm);
                        if (!$scope.transactionForm.$valid) {
                            return;
                        }

                        switch (transactionOperationType) {
                            case 'create':
                                operation = createTransaction($scope.id, $scope.model, Transaction);
                                break;
                            case 'edit':
                                operation = saveTransaction($scope.id, $scope.model, Transaction);
                                break;
                            default:
                                logger.error('Unknown operation "' + transactionOperationType + '"');
                        }

                        operation
                            .done(function (transaction) {
                                logger.log('Transaction saved');
                                $modalInstance.close(transaction);
                            })
                            .fail(function (error) {
                                logger.error(error);
                            });
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                }
            ]
        );

        return controllerName;
    }
);

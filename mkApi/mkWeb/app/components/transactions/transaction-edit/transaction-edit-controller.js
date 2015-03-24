define(
    [
        'mkControllers',
        'json!enums',
        'json!config',
        'underscore',
        'datedropper',
        'logger',
        '../transactions-services',
        '../../currencies/currencies-services'
    ],
    function (mkControllers, enums, config, _, $, logger) {
        var scopeApplySafely = function ($scope, callback) {
            var interval = 10;
            var phase = $scope.$$phase;

            if(phase !== '$apply' && phase !== '$digest') {
                $scope.$apply(callback);
            } else {
                setTimeout(function () {
                    scopeApplySafely($scope, callback);
                }, interval);
            }
        };

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
                    logger.logAccounts(categories);
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
                    logger.logAccounts(categories);
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
        var initTransactionField = function (transaction, field, list, fieldProperty) {
            var currentValue = _.isObject(transaction[field])
                ? transaction[field][fieldProperty]
                : transaction[field];
            var findCondition;

            findCondition = {};
            findCondition[fieldProperty] = currentValue;

            transaction[field] = _.findWhere(list, findCondition);
            transaction[field] = transaction[field] ? transaction[field] : currentValue;
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

                    initTransactionField(transaction, 'accountSource', accountsList, '_id');
                    initTransactionField(transaction, 'accountDestination', accountsList, '_id');
                    initTransactionField(transaction, 'category', categoriesList, '_id');
                    initTransactionField(transaction, 'type', transactionTypesList, 'value');

                    if (transactionType === enums.transactionTypes.transfer.value) {
                        formControlInit($scope, 'accountDestination', accountsList);
                        formControlDisable($scope, 'category');
                    } else {
                        formControlInit($scope, 'category', categoriesList);
                        formControlDisable($scope, 'accountDestination');
                    }

                    formControlInit($scope, 'value');
                    formControlInit($scope, 'date');
                    formControlInit($scope, 'transactionTypes', transactionTypesList);
                    formControlInit($scope, 'accountSource', accountsList);
                    formControlInit($scope, 'note');

                    formControlInit($scope, 'submit');

                    result.resolve(transaction);
                })
                .fail(function (error) {
                    result.reject(error);
                });

            return result.promise();
        };
        var createTransaction = function (id, model, transactionFactory) {
            var preparedData;
            var result = new $.Deferred();

            preparedData = model;

            logger.info('preparedData', preparedData);
            result.resolve();
            return result.promise();

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

            preparedData = model;

            logger.info('preparedData', preparedData);
            result.resolve();
            return result.promise();

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
        var formControlInit = function ($scope, controlName, controlData) {
            if (!$scope.formState[controlName]) {
                logger.error('Control "' + controlName + '" does not exist.');

                return;
            }

            $scope.formState[controlName].enable = true;
            $scope.formState[controlName].visible = true;

            if (controlData) {
                $scope.formState[controlName].data = controlData;
            }
        };
        var formControlDisable = function ($scope, controlName) {
            if (!$scope.formState[controlName]) {
                logger.error('Control "' + controlName + '" does not exist.');

                return;
            }

            $scope.formState[controlName].enable = false;
            $scope.formState[controlName].visible = false;
            $scope.formState[controlName].data = [];
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
            'TransactionEditCtrl',
            [
                '$scope',
                '$routeParams',
                '$filter',
                'Transaction',
                'Category',
                'Account',
                function ($scope, $routeParams, $filter, Transaction, Category, Account) {
                    logger.info('--- Edit Transaction controller initialize ---');
                    logger.time('Edit Transaction controller initialize');

                    var transactionOperationType;
                    var transactionPromise;

                    $scope.id = $routeParams.id;
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
                                scopeApplySafely($scope);
                                logger.timeEnd('Edit Transaction controller initialize');
                            })
                            .fail(function (error) {
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
                            .done(function () {
                                logger.log('Transaction saved');
                                window.history.back();
                            })
                            .fail(function (error) {
                                logger.error(error);
                            });
                    };

                    $scope.Cancel = function () {
                        window.history.back();
                    };


                    /*
                    function editTransaction() {



                        var dateStr;
                        var saveData = _.clone($scope.model);


                        $scope.formState.submit.enable = false;
                        
                        

                        dateStr = $scope.model.date;
                        $scope.model.date = new Date();
                        $scope.model.date.setTime(Date.parse(dateStr));

                        $scope.model.accountSource = typeof $scope.model.accountSource === 'object'
                            ? $scope.model.accountSource._id
                            : $scope.model.accountSource;

                        if ($scope.type.value !== enums.transactionTypes.transfer.value) {
                            $scope.model.category = typeof $scope.model.category === 'object'
                                ? $scope.model.category._id
                                : $scope.model.category;
                            $scope.model.accountDestination = null;
                        } else {
                            $scope.model.category = null;
                            $scope.model.accountDestination = typeof $scope.model.accountDestination === 'object'
                                ? $scope.model.accountDestination._id
                                : $scope.model.accountDestination;
                        }

                    }
                     */


                }
            ]
        );

        return;
    }
);

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
        // Accounts
        var storedAccounts;
        var getAccounts = function (accountsFactory) {
            var result = new $.Deferred();

            logger.log('-- Getting accounts...');

            if (storedAccounts) {
                logger.log('Return stored accounts');
                result.resolve(storedAccounts);
                return result.promise();
            }

            logger.time('Getting accounts');
            accountsFactory.query(
                function (accounts) {
                    logger.timeEnd('Getting accounts');
                    logger.groupCollapsed('Getting accounts result:');
                    logger.logAccounts(accounts);
                    logger.groupEnd('Getting accounts result:');

                    storedAccounts = accounts;
                    result.resolve(storedAccounts)
                },
                function (error) {
                    logger.timeEnd('Getting accounts');
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

            logger.log('-- Getting income categories...');

            if (storedIncomeCategories) {
                logger.log('Return stored income categories');
                result.resolve(storedIncomeCategories);
                return result.promise();
            }

            logger.time('Getting income categories');
            Category.getIncome(
                function (categories) {
                    logger.timeEnd('Getting income categories');
                    logger.groupCollapsed('Getting income categories result:');
                    logger.logAccounts(categories);
                    logger.groupEnd('Getting income categories result:');

                    storedIncomeCategories = categories;
                    result.resolve(storedIncomeCategories)
                },
                function (error) {
                    logger.timeEnd('Getting income categories');
                    logger.error(error);

                    result.reject(error);
                }
            );

            return result.promise();
        };

        var storedOutcomeCategories;
        var getOutcomeCategories = function (Category) {
            var result = new $.Deferred();

            logger.log('-- Getting outcome categories...');

            if (storedOutcomeCategories) {
                logger.log('Return stored outcome categories');
                result.resolve(storedOutcomeCategories);
                return result.promise();
            }

            logger.time('Getting outcome categories');
            Category.getOutcome(
                function (categories) {
                    logger.timeEnd('Getting outcome categories');
                    logger.groupCollapsed('Getting outcome categories result:');
                    logger.logAccounts(categories);
                    logger.groupEnd('Getting outcome categories result:');

                    storedOutcomeCategories = categories;
                    result.resolve(storedOutcomeCategories);
                },
                function (error) {
                    logger.timeEnd('Getting outcome categories');
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

            logger.log('Getting transaction... #' + id);
            logger.time('Getting transaction #' + id);

            transactionsFactory.get(
                {
                    id: id
                },
                function (transaction) {
                    logger.timeEnd('Getting transaction #' + id);

                    transactionDate = new Date(transaction.date);
                    transaction.date = transactionDate.toLocaleDateString(config.lang);

                    result.resolve(transaction);
                },
                function (error) {
                    logger.timeEnd('Getting transaction #' + $scope.id);

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
            transaction[field] = transaction[field] ? transaction[field] : null;
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
                    logger.log('--- Edit Transaction controller initialize');

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
                        var accounts;
                        var categories;
                        var transactionTypes;

                        $scope.model = transaction;

                        accounts = getAccounts(Account);
                        transactionTypes = getTransactionTypes(enums, $filter);
                        switch (transaction.type) {
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

                                logger.log('Initialized transaction:', transaction);

                                if (transactionType === enums.transactionTypes.transfer.value) {
                                    formControlInit($scope, 'accountDestination', accountsList);
                                    formControlDisable($scope, 'category');
                                } else {
                                    formControlInit($scope, 'category', categoriesList);
                                    formControlDisable($scope, 'accountDestination');
                                }

                                formControlInit($scope, 'value');
                                formControlInit($scope, 'transactionTypes', transactionTypesList);
                                formControlInit($scope, 'accountSource', accountsList);
                                formControlInit($scope, 'note');

                                formControlInit($scope, 'submit');
                            })
                            .fail(function (error) {
                                logger.error(error);

                                return;
                            });
                    });




                    /*
                    logger.log('Getting transaction... #' + $scope.id);
                    logger.time('Getting transaction #' + $scope.id);
                    Transaction.get(
                        {
                            id: $scope.id
                        },
                        function (transaction) {
                            $scope.type = _.findWhere($scope.formState.transactionTypes.data, {value: transaction.type});

                            typeChanged();
                        },
                        function (error) {
                            logger.timeEnd('Getting transaction #' + $scope.id);
                            logger.error(error);
                        }
                    );

                    getAccounts(Account)
                        .done(function (accounts) {
                            $scope.formState.accountSource.data = accounts;
                            $scope.formState.accountDestination.data = accounts;

                            $scope.formState.accountSource.enable = true;
                            $scope.formState.accountDestination.enable = true;
                        })
                        .fail(function (error) {
                            logger.error(error);
                        });


                    $scope.typeChanged = typeChanged;
                    $scope.dateChanged = function () {
                        console.warn('dateChanged');
                    };
                    $scope.editTransaction = editTransaction;

                    $scope.Cancel = function () {
                        window.history.back();
                    };
                    */





                    function typeChanged() {
                        logger.log('-- typeChanged calling');
                        logger.log('Current transactions type', $scope.type);
                        if (!$scope.type) {
                            logger.warn('Transactions type is not defined. Aborting.');
                            return;
                        }

                        switch ($scope.type.value) {
                            case 'income':
                                $scope.formState.accountDestination.visible = false;
                                $scope.formState.category.visible = true;

                                getIncomeCategories(Category)
                                    .done(successHandler)
                                    .fail(errorHandler);
                                break;
                            case 'outcome':
                                $scope.formState.accountDestination.visible = false;
                                $scope.formState.category.visible = true;

                                getOutcomeCategories(Category)
                                    .done(successHandler)
                                    .fail(errorHandler);
                                break;
                            default:
                                $scope.formState.accountDestination.visible = true;
                                $scope.formState.category.visible = false;
                        }

                        $scope.formState.transactionTypes.enable = false;
                        $scope.formState.category.enable = false;

                        function successHandler(categories) {
                            logger.log('Update categories list');

                            $scope.formState.category.data = categories;
                            $scope.formState.category.enable = true;
                            $scope.formState.transactionTypes.enable = true;
                        }

                        function errorHandler(error) {
                            logger.error(error);
                        }
                    }

                    /*
                    function editTransaction() {


                        logger.warn('date', $scope.model.date);
                        
                        logger.groupCollapsed('Editing transaction');

                        var dateStr;
                        var saveData = _.clone($scope.model);

                        console.log('saveData', saveData);

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

                        logger.log('date:', $scope.model.date);
                        logger.log('type:', $scope.type.value);
                        logger.log('category:', $scope.model.category);
                        logger.log('accountSource:', $scope.model.accountSource);
                        logger.log('accountDestination:', $scope.model.accountDestination);
                        logger.log('value:', $scope.model.value);
                        logger.log('note:', $scope.model.note);

                        logger.groupEnd('Editing transaction');

                        Transaction.update(
                            {
                                id: $scope.id
                            },
                            {
                                date: $scope.model.date,
                                category: $scope.model.category,
                                type: $scope.type.value,
                                accountSource: $scope.model.accountSource,
                                accountDestination: $scope.model.accountDestination,
                                value: $scope.model.value,
                                note: $scope.model.note
                            },
                            function () {
                                $scope.formState.submit.enable = true;
                                window.history.back();
                            },
                            function (error) {
                                $scope.formState.submit.enable = true;
                                logger.error(error);
                            }
                        );

                    }
                     */


                }
            ]
        );

        return;
    }
);

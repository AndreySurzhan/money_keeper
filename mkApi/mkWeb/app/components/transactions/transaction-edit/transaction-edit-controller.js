define(
    [
        'mkControllers',
        'json!enums',
        'underscore',
        'datedropper',
        'logger',
        '../transactions-services',
        '../../currencies/currencies-services'
    ],
    function (mkControllers, enums, _, $, logger) {
        // Accounts
        var storedAccounts;
        var getAccounts = function (Account) {
            var result = $.Deferred();

            logger.log('-- Getting accounts...');

            if (storedAccounts) {
                logger.log('Return stored accounts');
                result.resolve(storedAccounts);
                return result.promise();
            }

            logger.time('Getting accounts');
            Account.query(
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

        // Income categories
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

        // Outcome categories
        var storedOutcomeCategories;
        var getOutcomeCategories = function (Category) {
            var result = $.Deferred();

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

                    setInitialFormState($scope);
                    initTransactionTypes();

                    $scope.id = $routeParams.id;

                    logger.log('Getting transaction... #' + $scope.id);
                    logger.time('Getting transaction #' + $scope.id);
                    Transaction.get(
                        {
                            id: $scope.id
                        },
                        function (transaction) {
                            logger.timeEnd('Getting transaction #' + $scope.id);
                            logger.logTransactions([transaction]);

                            logger.groupCollapsed('Init transaction date');
                            $scope.date = transaction.date;
                            logger.log('current value:', $scope.date);
                            $scope.date = new Date($scope.date);
                            logger.log('parsed value:', $scope.date);
                            $scope.date = $scope.date.toLocaleDateString('ru');
                            logger.log('formated value:', $scope.date);

                            setTimeout(function () {
                                $( ".date-picker" ).dateDropper({
                                    format: 'd.m.Y',
                                    color: '#33414e',
                                    textColor: '#33414e',
                                    bgColor: '#F5F5F5'
                                });
                            }, 100);

                            logger.groupEnd('Init transaction date');

                            $scope.category = transaction.category;
                            $scope.accountSource = transaction.accountSource;
                            $scope.accountDestination = transaction.accountDestination;
                            $scope.value = transaction.value;
                            $scope.note = transaction.note;

                            logger.groupCollapsed('Init transaction type');
                            logger.log('transaction types:', $scope.transactionTypes);
                            logger.log('current transaction type value:', transaction.type);
                            $scope.type = _.findWhere($scope.formState.transactionTypes.data, {value: transaction.type});
                            logger.log('result:', $scope.type);
                            logger.groupEnd('Init transaction type');

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
                    $scope.editTransaction = editTransaction;

                    $scope.Cancel = function () {
                        window.history.back();
                    };

                    function setInitialFormState($scope) {
                        $scope.formState = {
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
                            submit: {
                                enable: true
                            }
                        };
                    }

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

                    function editTransaction() {
                        logger.groupCollapsed('Editing transaction');

                        var dateStr = new Date();

                        $scope.submitDisabled = true;

                        dateStr = $scope.date;
                        $scope.date = new Date();
                        $scope.date.setTime(Date.parse(dateStr));

                        $scope.accountSource = typeof $scope.accountSource === 'object'
                            ? $scope.accountSource._id
                            : $scope.accountSource;

                        if ($scope.type.value !== enums.transactionTypes.transfer.value) {
                            $scope.category = typeof $scope.category === 'object'
                                ? $scope.category._id
                                : $scope.category;$scope.date
                            $scope.accountDestination = null;
                        } else {
                            $scope.category = null;
                            $scope.accountDestination = typeof $scope.accountDestination === 'object'
                                ? $scope.accountDestination._id
                                : $scope.accountDestination;
                        }

                        logger.log('date:', $scope.date);
                        logger.log('type:', $scope.type.value);
                        logger.log('category:', $scope.category);
                        logger.log('accountSource:', $scope.accountSource);
                        logger.log('accountDestination:', $scope.accountDestination);
                        logger.log('value:', $scope.value);
                        logger.log('note:', $scope.note);

                        logger.groupEnd('Editing transaction');

                        Transaction.update(
                            {
                                id: $scope.id
                            },
                            {
                                date: $scope.date,
                                category: $scope.category,
                                type: $scope.type.value,
                                accountSource: $scope.accountSource,
                                accountDestination: $scope.accountDestination,
                                value: $scope.value,
                                note: $scope.note
                            },
                            function () {
                                $scope.submitDisabled = false;
                                window.history.back();
                            },
                            function (error) {
                                $scope.submitDisabled = false;
                                console.log(0);
                                console.error(error);
                            }
                        );

                    }

                    function initTransactionTypes () {
                        var types = [];

                        logger.groupCollapsed('Get transaction types');

                        for (var key in enums.transactionTypes) {
                            types.push({
                                name: $filter('translate')(enums.transactionTypes[key].name),
                                value: enums.transactionTypes[key].value
                            });
                        }
                        $scope.formState.transactionTypes.data = types;
                        $scope.formState.transactionTypes.enable = true;

                        logger.table($scope.formState.transactionTypes.data);
                        logger.groupEnd('Get transaction types');
                    }
                }
            ]
        );

        return;
    }
);

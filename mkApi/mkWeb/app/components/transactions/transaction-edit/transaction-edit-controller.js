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
                    //initTransactionTypes();

                    $scope.id = $routeParams.id;

                    logger.info($scope.id );

                    var date = new Date();

                    $scope.date = date.toLocaleDateString('ru');



                    $scope.editTransaction = editTransaction;




                    function editTransaction() {
                        console.log('editTransaction');
                        console.log($scope.date);
                    }

                    /*
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
                            $scope.model.date = transaction.date;
                            logger.log('current value:', $scope.model.date);
                            $scope.model.date = new Date($scope.model.date);
                            logger.log('parsed value:', $scope.model.date);
                            $scope.model.date = $scope.model.date.toLocaleDateString('ru');
                            logger.log('formated value:', $scope.model.date);

                            initCalendar();

                            logger.groupEnd('Init transaction date');

                            $scope.model.category = transaction.category;
                            $scope.model.accountSource = transaction.accountSource;
                            $scope.model.accountDestination = transaction.accountDestination;
                            $scope.model.value = transaction.value;
                            $scope.model.note = transaction.note;

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
                    $scope.dateChanged = function () {
                        console.warn('dateChanged');
                    };
                    $scope.editTransaction = editTransaction;

                    $scope.Cancel = function () {
                        window.history.back();
                    };
                    */



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

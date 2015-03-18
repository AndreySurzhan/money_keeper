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

        var storedAccounts;
        var storedAccountsPromise;
        var getAccounts = function (Account) {
            var result = $.Deferred();

            logger.log('-- Getting accounts...');

            if (storedAccounts) {
                logger.log('Return stored accounts');
                result.resolve(storedAccounts);
                return result.promise();
            }

            if (storedAccountsPromise) {
                return storedAccountsPromise;
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

            storedAccountsPromise = result.promise();

            return storedAccountsPromise;
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

                    $scope.selectCategoryData = [];
                    $scope.selectCategoryDisabled = true;
                    $scope.isTransfer = false;
                    $scope.selectAccountSourceData = [];
                    $scope.selectAccountDisabled = true;
                    $scope.submitDisabled = false;

                    $scope.id = $routeParams.id;

                    initTransactionTypes();


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
                            $scope.type = _.findWhere($scope.transactionTypes, {value: transaction.type});
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
                            $scope.selectAccountSourceData = accounts;
                            $scope.selectAccountDestinationData = accounts;
                            $scope.selectAccountDisabled = false;
                        })
                        .fail(function (error) {
                            $scope.selectAccountDisabled = false;
                        });


                    $scope.typeChanged = typeChanged;
                    $scope.editTransaction = editTransaction;

                    $scope.Cancel = function () {
                        window.history.back();
                    };

                    function typeChanged() {
                        logger.log('-- typeChanged calling');
                        logger.log('Current transactions type', $scope.type);
                        if (!$scope.type) {
                            logger.warn('Transactions type is not defined. Aborting.');
                            return;
                        }

                        switch ($scope.type.value) {
                            case 'income':
                                $scope.isTransfer = false;
                                logger.log('Getting income categories...');
                                logger.time('Getting categories');
                                Category.getIncome(successHandler, errorHandler);
                                break;
                            case 'outcome':
                                $scope.isTransfer = false;
                                logger.log('Getting outcome categories...');
                                logger.time('Getting categories');
                                Category.getOutcome(successHandler, errorHandler);
                                break;
                            default:
                                $scope.isTransfer = true;
                        }

                        $scope.selectCategoryDisabled = true;

                        function successHandler(categories) {
                            logger.timeEnd('Getting categories');
                            logger.logCategories(categories);

                            $scope.selectCategoryData = categories;
                            $scope.selectCategoryDisabled = false;
                        }

                        function errorHandler(error) {
                            logger.timeEnd('Getting categories');
                            logger.error(error);
                            $scope.selectCategoryDisabled = false;
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
                        logger.groupCollapsed('Get transaction types');
                        $scope.transactionTypes = [];
                        for (var key in enums.transactionTypes) {
                            $scope.transactionTypes.push({
                                name: $filter('translate')(enums.transactionTypes[key].name),
                                value: enums.transactionTypes[key].value
                            });
                        }
                        logger.table($scope.transactionTypes);
                        logger.groupEnd('Get transaction types');
                    }

                }
            ]
        );

        return;
    }
);

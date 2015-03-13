define(
    [
        'mkControllers',
        'json!enums',
        'underscore',
        '../transactions-services',
        '../../currencies/currencies-services'
    ],
    function (mkControllers, enums, _) {
        mkControllers.controller(
            'TransactionCreateCtrl',
            [
                '$scope',
                '$filter',
                'Transaction',
                'Category',
                'Account',
                function ($scope, $filter, Transaction, Category, Account) {
                    $scope.selectCategoryData = [];
                    $scope.selectCategoryDisabled = true;
                    $scope.isTransfer = false;
                    $scope.selectAccountSourceData = [];
                    $scope.selectAccountDisabled = true;
                    $scope.submitDisabled = false;

                    $scope.transactionTypes = [];
                    for (var key in enums.transactionTypes) {
                        $scope.transactionTypes.push({
                            name: $filter('translate')(enums.transactionTypes[key].name),
                            value: enums.transactionTypes[key].value
                        });
                    }

                    $scope.date = new Date();
                    $scope.category = 0;
                    $scope.accountSource = 0;
                    $scope.accountDestination = 0;
                    $scope.value = 0;
                    $scope.type = _.findWhere($scope.transactionTypes, {value: enums.transactionTypes.outcome.value});
                    $scope.note = '';

                    typeChanged();

                    Account.query(
                        function (accounts) {
                            $scope.selectAccountSourceData = accounts
                            $scope.selectAccountDestinationData = accounts;
                            $scope.selectAccountDisabled = false;
                        },
                        function (error) {
                            console.error(error);
                            $scope.selectAccountDisabled = false;
                        }
                    );

                    $scope.typeChanged = typeChanged;
                    $scope.addTransaction = addTransaction;

                    $scope.Cancel = function () {
                        window.history.back();
                    };

                    function typeChanged() {
                        console.log('type', $scope.type);
                        var transactionType = $scope.type.value;

                        switch (transactionType) {
                            case 'income':
                                $scope.isTransfer = false;
                                Category.getIncome(successHandler, errorHandler);
                                break;
                            case 'outcome':
                                $scope.isTransfer = false;
                                Category.getOutcome(successHandler, errorHandler);
                                break;
                            default:
                                $scope.isTransfer = true;
                        }

                        $scope.selectCategoryDisabled = true;

                        function successHandler(categories) {
                            $scope.selectCategoryData = categories;
                            $scope.selectCategoryDisabled = false;
                        }

                        function errorHandler(error) {
                            console.error(error);
                            $scope.selectCategoryDisabled = false;
                        }
                    }

                    function addTransaction() {
                        $scope.submitDisabled = true;


                        $scope.accountSource = typeof $scope.accountSource === 'object'
                            ? $scope.accountSource._id
                            : $scope.accountSource;

                        if ($scope.type.value !== enums.transactionTypes.transfer.value) {
                            $scope.category = typeof $scope.category === 'object'
                                ? $scope.category._id
                                : $scope.category;
                            $scope.accountDestination = null;
                        } else {
                            $scope.category = null;
                            $scope.accountDestination = typeof $scope.accountDestination === 'object'
                                ? $scope.accountDestination._id
                                : $scope.accountDestination;
                        }

                        console.log('-------- add Transaction --------');
                        console.log('date:', $scope.date);
                        console.log('type:', $scope.type.value);
                        console.log('category:', $scope.category);
                        console.log('accountSource:', $scope.accountSource);
                        console.log('accountDestination:', $scope.accountDestination);
                        console.log('value:', $scope.value);
                        console.log('note:', $scope.note);


                        Transaction.save({
                                date: $scope.date,
                                category: $scope.category,
                                type: $scope.type.value,
                                accountSource: $scope.accountSource,
                                accountDestination: $scope.accountDestination,
                                value: $scope.value,
                                note: $scope.note
                            }, function () {
                                $scope.submitDisabled = false;
                                window.history.back();
                            }, function (error) {
                                $scope.submitDisabled = false;
                                console.log(0);
                                console.error(error);
                            }
                        );

                    }
                }
            ]
        );

        return;
    }
);

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
            'TransactionEditCtrl',
            [
                '$scope',
                '$routeParams',
                '$filter',
                'Transaction',
                'Category',
                'Account',
                function ($scope, $routeParams, $filter, Transaction, Category, Account) {
                    $scope.selectCategoryData = [];
                    $scope.selectCategoryDisabled = true;
                    $scope.isTransfer = false;
                    $scope.selectAccountSourceData = [];
                    $scope.selectAccountDisabled = true;
                    $scope.submitDisabled = false;


                    $scope.id = $routeParams.id;
                    Transaction.get(
                        {
                            id: $scope.id
                        },
                        function (transaction) {
                            $scope.date = transaction.date;
                            $scope.category = transaction.category;
                            $scope.accountSource = transaction.accountSource;
                            $scope.accountDestination = transaction.accountDestination;
                            $scope.value = transaction.value;
                            $scope.type = _.findWhere($scope.transactionTypes, {value: transaction.type.value});;
                            $scope.note = transaction.note;
                        },
                        function () {
                            console.log('error', arguments);
                        }
                    );

                    $scope.transactionTypes = [];
                    for (var key in enums.transactionTypes) {
                        $scope.transactionTypes.push({
                            name: $filter('translate')(enums.transactionTypes[key].name),
                            value: enums.transactionTypes[key].value
                        });
                    }

                    /*
                    $scope.date = (new Date()).toString();
                    $scope.category = 0;
                    $scope.accountSource = 0;
                    $scope.accountDestination = 0;
                    $scope.value = 0;
                    $scope.type = _.findWhere($scope.transactionTypes, {value: enums.transactionTypes.outcome.value});
                    $scope.note = '';
                    */

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

                    // -----

                    $( ".date-picker" ).dateDropper({
                        format: 'd-m-Y',
                        color: '#33414e',
                        textColor: '#33414e',
                        bgColor: '#F5F5F5'
                    });

                    // -----

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

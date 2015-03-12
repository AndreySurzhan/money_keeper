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
                    $scope.selectCategoryVisible = true;
                    $scope.selectAccountData = [];
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
                    $scope.account = 0;
                    $scope.value = 0;
                    $scope.type = _.findWhere($scope.transactionTypes, { value: enums.transactionTypes.outcome.value});
                    $scope.note = '';

                    typeChanged();

                    Account.query(
                        function (accounts) {
                            $scope.selectAccountData = accounts;
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
                                $scope.selectCategoryVisible = true;
                                Category.getIncome(successHandler, errorHandler);
                                break;
                            case 'outcome':
                                $scope.selectCategoryVisible = true;
                                Category.getOutcome(successHandler, errorHandler);
                                break;
                            default:
                                $scope.selectCategoryVisible = false;
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

                        $scope.category = typeof $scope.category === 'object' ? $scope.category._id : $scope.category;
                        $scope.account = typeof $scope.account === 'object' ? $scope.account._id : $scope.account;

                        console.log('-------- add Transaction --------');
                        console.log('date:', $scope.date);
                        console.log('category:', $scope.category);
                        console.log('account:', $scope.account);
                        console.log('value:', $scope.value);
                        console.log('note:', $scope.note);

                        Transaction.save({
                                date: $scope.date,
                                category: $scope.category,
                                account: $scope.account,
                                value: $scope.value,
                                note: $scope.note
                            }, function () {
                                window.history.back();
                            }, function (error) {
                                console.log(0);
                                console.err(error);
                            }
                        );
                    }
                }
            ]
        );

        return;
    }
);

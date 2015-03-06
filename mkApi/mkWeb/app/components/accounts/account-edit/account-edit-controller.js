define(
    [
        'mkControllers',
        '../accounts-services',
        '../../currencies/currencies-services'
    ],
    function (mkControllers) {
        mkControllers.controller(
            'AccountEditCtrl',
            [
                '$scope',
                '$routeParams',
                'Account',
                'Currency',
                function ($scope, $routeParams, Account, Currency) {
                    $scope.selectCurrencyData = [];
                    $scope.selectCurrencyDisabled = true;
                    $scope.submitDisabled = false;

                    $scope.name = '';
                    $scope.initValue = 0;
                    $scope.currency = 0;

                    Currency.query(
                        function (currencies) {
                            $scope.selectCurrencyData = currencies;
                            $scope.selectCurrencyDisabled = false;

                            for (var i = 0; i < currencies.length; i++) {
                                if (currencies[i]._id === $scope.currencyId) {
                                    $scope.currency = currencies[i];
                                    break;
                                }
                            }
                        },
                        function (error) {
                            console.error(error);
                            $scope.selectCurrencyDisabled = false;
                        }
                    );

                    $scope.id = $routeParams.id;
                    Account.get(
                        {
                            id: $scope.id
                        },
                        function (account) {
                            console.log('Edited account', account);

                            $scope.name = account.name;
                            $scope.initValue = account.initValue;
                            $scope.currencyId = account.currency ? account.currency._id : 0;
                        },
                        function () {
                            console.log('error', arguments);
                        }
                    );

                    $scope.editAccount = function () {
                        $scope.submitDisabled = true;

                        $scope.currency = typeof $scope.currency === 'object' ? $scope.currency._id : $scope.currency;

                        console.log('-------- edit Account --------');
                        console.log(arguments);
                        console.log('name:', $scope.name);
                        console.log('currency:', $scope.currency);
                        console.log('initValue:', $scope.initValue);

                        Account.update(
                            {
                                'id': $scope.id
                            },
                            {
                                'name': $scope.name,
                                'currency': $scope.currency,
                                'initValue': $scope.initValue
                            }, function () {
                                window.history.back();
                            }, function (error) {
                                console.log(0);
                                console.err(error);
                            }
                        );
                    };

                    $scope.Cancel = function () {
                        window.history.back();
                    };
                }
            ]
        );

        return;
    }
);


/*

 $scope.id = $routeParams.id;
 Category.get(
 {
 id: $scope.id
 },
 function (category) {
 $scope.name = category.name;
 $scope.income = category.income;
 $scope.parentId = category.parent ? category.parent._id : 0;

 $scope.incomeChanged()
 },
 function () {
 console.log('error', arguments);
 }
 );

 */

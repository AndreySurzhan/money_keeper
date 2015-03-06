define(
    [
        'mkControllers',
        '../accounts-services',
        '../../currencies/currencies-services'
    ],
    function (mkControllers) {
        mkControllers.controller(
            'AccountCreateCtrl',
            [
                '$scope',
                'Account',
                'Currency',
                function ($scope, Account, Currency) {
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
                        },
                        function (error) {
                            console.error(error);
                            $scope.selectCurrencyDisabled = false;
                        }
                    );

                    $scope.addAccount = function () {
                        $scope.submitDisabled = true;

                        $scope.currency = typeof $scope.currency === 'object' ? $scope.currency._id : $scope.currency;

                        console.log('-------- addCategory --------');
                        console.log(arguments);
                        console.log('name:', $scope.name);
                        console.log('currency:', $scope.currency);
                        console.log('initValue:', $scope.initValue);


                        Account.save({
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

define(
    [
        'mkControllers',
        './currencies-services'
    ],
    function (mkControllers) {
        mkControllers.controller(
            'CurrencyListCtrl',
            [
                '$scope',
                'Currency',
                function ($scope, Currency) {

                    $scope.currencies = Currency.query();
                    $scope.orderProp = '_id';

                    $scope.showDetails = function (currencyId) {
                        console.log('showDetails');
                        console.log(currencyId);

                        window.location.hash = '#/currencies/' + currencyId;
                    };

                    $scope.remove = function (currencyId) {
                        Currency.remove(
                            {
                                id: currencyId
                            },
                            function (currencies) {
                                $scope.currencies = currencies;
                            },
                            function () {
                                console.error('error', arguments);
                            }
                        );
                    };
                }
            ]
        );

        return;
    }
);

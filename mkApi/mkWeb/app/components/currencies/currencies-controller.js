define(
    [
        'mkControllers',
        'logger',
        './currencies-services'
    ],
    function (mkControllers, logger) {
        var updateCurrenciesList = function ($scope, currenciesFactory) {
            var result = new $.Deferred();

            logger.time('Updating currencies list');

            $scope.isUpdating = true;

            currenciesFactory.query(
                function (currencies) {
                    logger.timeEnd('Updating currencies list');
                    logger.groupCollapsed('Updating currencies list');
                    logger.logCurrencies(currencies);
                    logger.groupEnd('Updating currencies list');

                    $scope.isUpdating = false;
                    result.resolve(currencies);
                },
                function (error) {
                    logger.error(error);
                    $scope.isUpdating = false;
                    result.reject(error);
                }
            );

            return result.promise();
        };

        mkControllers.controller(
            'CurrencyListCtrl',
            [
                '$scope',
                'Currency',
                'Analytics',
                function ($scope, Currency, Analytics) {
                    $scope.currencies = [];
                    $scope.orderProp = '_id';

                    Analytics.trackPage('/currencies');

                    updateCurrenciesList($scope, Currency)
                        .done(function (currencies) {
                            $scope.currencies = currencies
                        })
                        .fail(function (error) {
                            $scope.currencies = [];
                        });

                    $scope.refresh = function () {
                        updateCurrenciesList($scope, Currency)
                            .done(function (currencies) {
                                $scope.currencies = currencies
                            })
                            .fail(function (error) {
                                $scope.currencies = [];
                            });
                    };

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

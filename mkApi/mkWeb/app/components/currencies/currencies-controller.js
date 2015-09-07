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

        var getGlobalCurrencies = function ($filter, currenciesFactory) {
            var result = new $.Deferred();

            logger.time('Getting global currencies list');

            currenciesFactory.getGlobals(
                function (currencies) {
                    var i;

                    logger.timeEnd('Getting global currencies list');
                    logger.groupCollapsed('Getting global currencies list');
                    logger.logCurrencies(currencies);
                    logger.groupEnd('Getting global currencies list');

                    for (i = 0; i < currencies.length; i++) {
                        currencies[i].name = $filter('translate')('common.currencies.' + currencies[i].name);
                    }

                    result.resolve(currencies);
                },
                function (error) {
                    logger.error(error);
                    result.reject(error);
                }
            );

            return result.promise();
        };

        mkControllers.controller(
            'CurrencyListCtrl',
            [
                '$scope',
                '$filter',
                'Currency',
                'Analytics',
                function ($scope, $filter, Currency, Analytics) {
                    $scope.currencies = [];
                    $scope.orderProp = '_id';
                    $scope.newCurrency = null;
                    $scope.formState = {
                        globalCurrencies: {
                            data: [],
                            enable: false
                        }
                    };

                    Analytics.trackPage('/currencies');

                    updateCurrenciesList($scope, Currency)
                        .done(function (currencies) {
                            $scope.currencies = currencies
                        })
                        .fail(function (error) {
                            $scope.currencies = [];
                        });

                    getGlobalCurrencies($filter, Currency)
                        .done(function (currencies) {
                            $scope.formState.globalCurrencies.data = currencies;
                            $scope.formState.globalCurrencies.enable = true;
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

                    $scope.addNewCurrency = function (globalCurrencyId) {
                        console.log(globalCurrencyId);
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

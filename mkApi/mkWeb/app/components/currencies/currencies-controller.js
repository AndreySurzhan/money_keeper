define(
    [
        'mkControllers',
        'logger',
        './currencies-services'
    ],
    function (mkControllers, logger) {
        var updateCurrenciesList = function ($scope, $filter, currenciesFactory) {
            var result = new $.Deferred();

            logger.time('Updating currencies list');

            $scope.isUpdating = true;

            currenciesFactory.query(
                function (currencies) {
                    logger.timeEnd('Updating currencies list');
                    logger.groupCollapsed('Updating currencies list');
                    logger.logCurrencies(currencies);
                    logger.groupEnd('Updating currencies list');

                    translateCurrenciesList(currencies, $filter);

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
                    logger.timeEnd('Getting global currencies list');
                    logger.groupCollapsed('Getting global currencies list');
                    logger.logCurrencies(currencies);
                    logger.groupEnd('Getting global currencies list');

                    translateCurrenciesList(currencies, $filter);

                    result.resolve(currencies);
                },
                function (error) {
                    logger.error(error);
                    result.reject(error);
                }
            );

            return result.promise();
        };

        var translateCurrency = function (currency, $filter) {
            currency.name = $filter('translate')('common.currencies.' + currency.name);

            return currency;
        };

        var translateCurrenciesList = function (currencies, $filter) {
            var i;

            for (i = 0; i < currencies.length; i++) {
                currencies[i] = translateCurrency(currencies[i], $filter);
            }

            return currencies;
        };

        mkControllers.controller(
            'CurrencyListCtrl',
            [
                '$scope',
                '$filter',
                'Currency',
                'Analytics',
                function ($scope, $filter, Currency, Analytics) {
                    $scope.currencyTranslatePrefix = '';
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

                    updateCurrenciesList($scope, $filter, Currency)
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
                        updateCurrenciesList($scope, $filter, Currency)
                            .done(function (currencies) {
                                $scope.currencies = currencies;
                            })
                            .fail(function (error) {
                                $scope.currencies = [];
                            });
                    };

                    $scope.addNewCurrency = function (globalCurrency) {
                        $scope.isUpdating = true;

                        Currency.save(
                            {
                                globalCurrencyId: globalCurrency._id
                            },
                            function (currency) {
                                $scope.currencies.push(translateCurrency(currency, $filter));
                                $scope.isUpdating = false;
                            },
                            function (error) {
                                $scope.isUpdating = false;
                                logger.error(error);
                            }
                        );
                    };

                    $scope.remove = function (currencyId) {
                        $scope.isUpdating = true;

                        Currency.remove(
                            {
                                id: currencyId
                            },
                            function (currencies) {
                                $scope.currencies = translateCurrenciesList(currencies, $filter);
                                $scope.isUpdating = false;
                            },
                            function (error) {
                                $scope.isUpdating = false;
                                logger.error(error);
                            }
                        );
                    };
                }
            ]
        );

        return;
    }
);

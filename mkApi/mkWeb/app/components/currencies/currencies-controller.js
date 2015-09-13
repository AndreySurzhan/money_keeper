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

        var globalCurrencies = null;

        var getGlobalCurrencies = function ($filter, currenciesFactory) {
            var result = new $.Deferred();

            if (!_.isNull(globalCurrencies)) {
                logger.log('Global currencies are returned from cache.');
                result.resolve(globalCurrencies);

                return result.promise();
            }

            logger.time('Getting global currencies list');

            currenciesFactory.getGlobals(
                function (currencies) {
                    logger.timeEnd('Getting global currencies list');
                    logger.groupCollapsed('Getting global currencies list');
                    logger.logCurrencies(currencies);
                    logger.groupEnd('Getting global currencies list');

                    translateCurrenciesList(currencies, $filter);

                    globalCurrencies = currencies;
                    result.resolve(globalCurrencies);
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

        var filterGlobalCurrenciesBySelected = function (globalCurrencies, selectedCurrencies) {
            var selectedIds = _.pluck(selectedCurrencies, 'globalId');

            return _.filter(globalCurrencies, function (globalCurrency) {
                return !_.contains(selectedIds, globalCurrency._id);
            });
        };

        mkControllers.controller(
            'CurrencyListCtrl',
            [
                '$scope',
                '$filter',
                'Currency',
                'Analytics',
                function ($scope, $filter, Currency, Analytics) {
                    var globalCurrencies = [];
                    var updateCurrenciesPromise;

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

                    updateCurrenciesPromise = updateCurrenciesList($scope, $filter, Currency)
                        .done(function (currencies) {
                            $scope.currencies = currencies
                        })
                        .fail(function (error) {
                            $scope.currencies = [];
                        });

                    $.when(
                        getGlobalCurrencies($filter, Currency),
                        updateCurrenciesPromise
                    )
                        .done(function (currencies) {
                            globalCurrencies = currencies;

                            $scope.formState.globalCurrencies.data = filterGlobalCurrenciesBySelected(
                                globalCurrencies,
                                $scope.currencies
                            );

                            if ($scope.formState.globalCurrencies.data.length > 0) {
                                $scope.newCurrency = $scope.formState.globalCurrencies.data[0];
                            }

                            $scope.formState.globalCurrencies.enable = true;
                        });

                    $scope.refresh = function () {
                        updateCurrenciesList($scope, $filter, Currency)
                            .done(function (currencies) {
                                $scope.currencies = currencies;
                                $scope.formState.globalCurrencies.data = filterGlobalCurrenciesBySelected(
                                    globalCurrencies,
                                    $scope.currencies
                                );

                                if ($scope.formState.globalCurrencies.data.length > 0) {
                                    $scope.newCurrency = $scope.formState.globalCurrencies.data[0];
                                }
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
                                $scope.formState.globalCurrencies.data = filterGlobalCurrenciesBySelected(
                                    globalCurrencies,
                                    $scope.currencies
                                );

                                if ($scope.formState.globalCurrencies.data.length > 0) {
                                    $scope.newCurrency = $scope.formState.globalCurrencies.data[0];
                                } else {
                                    $scope.newCurrency = null;
                                }
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
                                $scope.formState.globalCurrencies.data = filterGlobalCurrenciesBySelected(
                                    globalCurrencies,
                                    $scope.currencies
                                );

                                if ($scope.formState.globalCurrencies.data.length > 0) {
                                    $scope.newCurrency = $scope.formState.globalCurrencies.data[0];
                                }
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

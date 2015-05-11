define(
    [
        'mkControllers',
        'logger',
        'scopeUtil',
        'formUtil',
        '../currencies-services'
    ],
    function (mkControllers, logger, scopeUtil, formUtil) {

        // Currencies
        var getEmptyCurrencyData = function () {
            var result = new $.Deferred();

            logger.log('Creating empty currency');

            result.resolve({
                name: ''
            });

            return result.promise();
        };
        var getCurrencyDataById = function (id, currenciesFactory) {
            var result = new $.Deferred();

            logger.groupCollapsed('Getting currency  #' + id);
            logger.time('Getting currency #' + id);
            currenciesFactory.get(
                {
                    id: id
                },
                function (currency) {
                    logger.timeEnd('Getting currency #' + id);
                    logger.logCurrencies(currency);
                    logger.groupEnd('Getting currency  #' + id);

                    result.resolve(currency);
                },
                function (error) {
                    logger.timeEnd('Getting currency #' + id);
                    logger.groupEnd('Getting currency  #' + id);

                    result.reject(error);
                }
            );

            return result.promise();
        };
        var initCurrencyForm = function (currency, currenciesFactory, $scope) {
            var result = new $.Deferred();

            formUtil.initControl($scope, 'name');
            formUtil.initControl($scope, 'submit');

            result.resolve(currency);

            return result.promise();
        };
        var getPreparedData = function (data) {
            var attributesMap = {
                name: function (name) {
                    return name;
                }
            };
            var preparedData = {};

            for (var attribute in attributesMap) {
                if (!attributesMap.hasOwnProperty(attribute)) {
                    return;
                }

                preparedData[attribute] = attributesMap[attribute](data[attribute]);
            }

            return preparedData;
        };
        var createCurrency = function (id, model, currenciesFactory) {
            var preparedData;
            var result = new $.Deferred();

            preparedData = getPreparedData(model);

            currenciesFactory.save(
                preparedData,
                function (currency) {
                    result.resolve(currency);
                },
                function (error) {
                    result.reject(error);
                }
            );

            return result.promise();
        };
        var saveCurrency = function (id, model, currenciesFactory) {
            var preparedData;
            var result = new $.Deferred();

            preparedData = getPreparedData(model);
            delete preparedData.income;

            currenciesFactory.update(
                {
                    id: id
                },
                preparedData,
                function (category) {
                    result.resolve(category);
                },
                function (error) {
                    result.reject(error);
                }
            );

            return result.promise();
        };

        // Form state
        var setInitialFormState = function ($scope) {
            $scope.formState = {
                name: {
                    enable: false
                },
                submit: {
                    enable: false
                },
                texts: {
                    header: 'header',
                    saveButton: 'save button'
                }
            };
        };
        var setCreateCurrencyTexts = function ($scope, $filter) {
            $scope.formState.texts.header = $filter('translate')('components.currencies.create.header');
            $scope.formState.texts.saveButton = $filter('translate')('common.buttons.create');

        };
        var setEditCurrencyTexts = function ($scope, $filter) {
            $scope.formState.texts.header = $filter('translate')('components.currencies.edit.header');
            $scope.formState.texts.saveButton = $filter('translate')('common.buttons.save');
        };

        mkControllers.controller(
            'CurrencyEditCtrl',
            [
                '$scope',
                '$filter',
                '$routeParams',
                'Currency',
                function ($scope, $filter, $routeParams, Currency) {
                    logger.info('--- Edit Currency controller initialize ---');
                    logger.time('Edit Currency controller initialize');

                    var currencyOperationType;
                    var currencyPromise;

                    $scope.id = $routeParams.id;
                    setInitialFormState($scope);

                    if ($scope.id === 'add') {
                        currencyOperationType = 'create';
                        setCreateCurrencyTexts($scope, $filter);
                        currencyPromise = getEmptyCurrencyData();
                    } else {
                        currencyOperationType = 'edit';
                        setEditCurrencyTexts($scope, $filter);
                        currencyPromise = getCurrencyDataById($scope.id, Currency);
                    }

                    currencyPromise.done(function (currency) {
                        initCurrencyForm(currency, Currency, $scope)
                            .done(function (currency) {
                                $scope.model = currency;
                                scopeUtil.applySafely($scope);
                                logger.timeEnd('Edit Currency controller initialize');
                            })
                            .fail(function (error) {
                                logger.timeEnd('Edit Currency controller initialize');
                                logger.error(error);
                            });
                    });

                    $scope.executeOperation = function () {
                        var operation;

                        formUtil.validateForm($scope.currencyForm);
                        if (!$scope.currencyForm.$valid) {
                            return;
                        }

                        switch (currencyOperationType) {
                            case 'create':
                                operation = createCurrency($scope.id, $scope.model, Currency);
                                break;
                            case 'edit':
                                operation = saveCurrency($scope.id, $scope.model, Currency);
                                break;
                            default:
                                logger.error('Unknown operation "' + currencyOperationType + '"');
                        }

                        operation
                            .done(function () {
                                logger.log('Currency saved');
                                window.history.back();
                            })
                            .fail(function (error) {
                                logger.error(error);
                            });
                    };

                    $scope.cancel = function () {
                        window.history.back();
                    };
                }
            ]
        );

        return;
    }
);

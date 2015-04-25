define(
    [
        'mkControllers',
        'logger',
        'scopeUtil',
        'entityUtil',
        'formUtil',
        '../accounts-services',
        '../../currencies/currencies-services'
    ],
    function (mkControllers, logger, scopeUtil, entityUtil, formUtil) {
        // Currencies
        var getCurrencies = function (currenciesFactory) {
            var result = new $.Deferred();

            logger.groupCollapsed('Getting currencies');
            logger.time('Getting currencies');

            currenciesFactory.query(
                function (currencies) {
                    logger.timeEnd('Getting currencies');
                    logger.table(currencies);
                    logger.groupEnd('Getting currencies');

                    result.resolve(currencies);
                },
                function (error) {
                    logger.timeEnd('Getting currencies');
                    logger.groupEnd('Getting currencies');
                    logger.error(error);

                    result.reject(error);
                }
            );

            return result.promise();
        };

        // Accounts
        var getEmptyAccountData = function () {
            var result = new $.Deferred();

            logger.log('Creating empty account');

            result.resolve({
                name: '',
                initValue: 0,
                currency: 0
            });

            return result.promise();
        };
        var getAccountDataById = function (id, accountsFactory) {
            var result = new $.Deferred();

            logger.groupCollapsed('Getting account  #' + id);
            logger.time('Getting account #' + id);
            accountsFactory.get(
                {
                    id: id
                },
                function (account) {
                    logger.timeEnd('Getting account #' + id);
                    logger.logAccounts(account);
                    logger.groupEnd('Getting account  #' + id);

                    result.resolve(account);
                },
                function (error) {
                    logger.timeEnd('Getting account #' + id);
                    logger.groupEnd('Getting account  #' + id);

                    result.reject(error);
                }
            );

            return result.promise();
        };
        var initAccountForm = function (account, currenciesFactory, $scope) {
            var result = new $.Deferred();
            var currencies;

            currencies = getCurrencies(currenciesFactory);

            $.when(currencies)
                .done(function (currenciesList) {
                    entityUtil.normalizeEntityField(account, 'currency', '_id', currenciesList);

                    formUtil.initControl($scope, 'name');
                    formUtil.initControl($scope, 'currency', {
                        data: currenciesList
                    });
                    formUtil.initControl($scope, 'initValue');

                    formUtil.initControl($scope, 'submit');

                    result.resolve(account);
                })
                .fail(function (error) {
                    result.reject(error);
                });

            return result.promise();
        };
        var getPreparedData = function (data) {
            var attributesMap = {
                name: function (name) {
                    return name;
                },
                initValue: function (initValue) {
                    return initValue;
                },
                currency: function (currency) {
                    var currencyId;

                    if (_.isObject(currency)) {
                        currencyId = currency._id;
                    } else {
                        currencyId = currency;
                    }

                    currencyId = currencyId === 0 ? null : currencyId;

                    return currencyId;
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
        var createAccount = function (id, model, accountsFactory) {
            var preparedData;
            var result = new $.Deferred();

            preparedData = getPreparedData(model);

            accountsFactory.save(
                preparedData,
                function (account) {
                    result.resolve(account);
                },
                function (error) {
                    result.reject(error);
                }
            );

            return result.promise();
        };
        var saveAccount = function (id, model, accountsFactory) {
            var preparedData;
            var result = new $.Deferred();

            preparedData = getPreparedData(model);

            accountsFactory.update(
                {
                    id: id
                },
                preparedData,
                function (account) {
                    result.resolve(account);
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
                initValue: {
                    enable: false
                },
                currency: {
                    data: [],
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
        var setCreateAccountTexts = function ($scope, $filter) {
            $scope.formState.texts.header = $filter('translate')('components.accounts.create.header');
            $scope.formState.texts.saveButton = $filter('translate')('common.buttons.create');
        };
        var setEditAccountTexts = function ($scope, $filter) {
            $scope.formState.texts.header = $filter('translate')('components.accounts.edit.header');
            $scope.formState.texts.saveButton = $filter('translate')('common.buttons.save');
        };

        mkControllers.controller(
            'AccountEditCtrl',
            [
                '$scope',
                '$filter',
                '$routeParams',
                'Account',
                'Currency',
                function ($scope, $filter, $routeParams, Account, Currency) {
                    logger.info('--- Edit Account controller initialize ---');
                    logger.time('Edit Account controller initialize');

                    var accountOperationType;
                    var accountPromise;

                    $scope.id = $routeParams.id;
                    setInitialFormState($scope);

                    if ($scope.id === 'add') {
                        accountOperationType = 'create';
                        setCreateAccountTexts($scope, $filter);
                        accountPromise = getEmptyAccountData();
                    } else {
                        accountOperationType = 'edit';
                        setEditAccountTexts($scope, $filter);
                        accountPromise = getAccountDataById($scope.id, Account);
                    }

                    accountPromise.done(function (account) {
                        initAccountForm(account, Currency, $scope)
                            .done(function (account) {
                                $scope.model = account;
                                scopeUtil.applySafely($scope);
                                logger.timeEnd('Edit Account controller initialize');
                            })
                            .fail(function (error) {
                                logger.timeEnd('Edit Account controller initialize');
                                logger.error(error);
                            });
                    });

                    $scope.executeOperation = function () {
                        var operation;

                        switch (accountOperationType) {
                            case 'create':
                                operation = createAccount($scope.id, $scope.model, Account);
                                break;
                            case 'edit':
                                operation = saveAccount($scope.id, $scope.model, Account);
                                break;
                            default:
                                logger.error('Unknown operation "' + accountOperationType + '"');
                        }

                        operation
                            .done(function () {
                                logger.log('Account saved');
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

define(
    [
        'mkControllers',
        'logger',
        'scopeUtil',
        './accounts-services'
    ],
    function (mkControllers, logger, scopeUtil) {
        var updateAccountsList = function ($scope, accountsFactory) {
            var result = new $.Deferred();

            logger.time('Updating accounts list');

            $scope.isUpdating = true;

            accountsFactory.query(
                function (accounts) {
                    logger.timeEnd('Updating accounts list');
                    logger.groupCollapsed('Updating accounts list');
                    logger.logAccounts(accounts);
                    logger.groupEnd('Updating accounts list');

                    $scope.isUpdating = false;
                    result.resolve(accounts);
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
            'AccountListCtrl',
            [
                '$scope',
                'Account',
                function ($scope, Account) {
                    $scope.accounts = [];
                    $scope.isUpdating = false;
                    $scope.orderProp = '_id';

                    updateAccountsList($scope, Account)
                        .done(function (accounts) {
                            $scope.accounts = accounts
                        })
                        .fail(function (error) {
                            $scope.accounts = [];
                        });

                    $scope.refresh = function () {
                        updateAccountsList($scope, Account)
                            .done(function (accounts) {
                                $scope.accounts = accounts
                            })
                            .fail(function (error) {
                                $scope.accounts = [];
                            });
                    };

                    $scope.recalculate = function (accountId) {
                        var account = _.findWhere(
                            $scope.accounts,
                            {
                                _id: accountId
                            }
                        );

                        account.recalculating = true;

                        Account.recalculate(
                            {
                                id: accountId
                            },
                            function (updatedAccount) {
                                account.recalculating = false;
                                account.value = updatedAccount.value;
                                scopeUtil.applySafely($scope);
                            },
                            function (error) {
                                account.recalculating = false;
                                logger.error('Recalculate error', error);
                            }
                        );
                    };

                    $scope.showDetails = function (accountId) {
                        console.log('showDetails');
                        console.log(accountId);
                        window.location.hash = '#/accounts/' + accountId;
                    };

                    $scope.remove = function (accountId) {
                        Account.remove(
                            {
                                id: accountId
                            },
                            function (accounts) {
                                $scope.accounts = accounts;
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

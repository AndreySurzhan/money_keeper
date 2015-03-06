define(
    [
        'mkControllers',
        './accounts-services'
    ],
    function (mkControllers) {
        mkControllers.controller(
            'AccountListCtrl',
            [
                '$scope',
                'Account',
                function ($scope, Account) {
                    $scope.accounts = Account.query();
                    $scope.orderProp = '_id';

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

define(
    [
        'app'
    ],
    function (app) {
        'use strict';

        var moduleUrl = 'app/components/transactions/transaction-create/';

        app.config(
            [
                '$routeProvider',
                function ($routeProvider) {
                    $routeProvider
                        .when('/transactions/add',
                        {
                            templateUrl: moduleUrl + 'transaction-create.html',
                            controller: 'TransactionCreateCtrl'
                        });
                }
            ]
        );

        return;
    }
);

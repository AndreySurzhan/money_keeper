define(
    [
        'app'
    ],
    function (app) {
        'use strict';

        var moduleUrl = 'app/components/transactions/';

        app.config(
            [
                '$routeProvider',
                function ($routeProvider) {
                    $routeProvider
                        .when('/transactions',
                        {
                            templateUrl: moduleUrl + 'transactions-list.html',
                            controller: 'TransactionListCtrl'
                        });
                }
            ]
        );

        return;
    }
);

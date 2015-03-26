define(
    [
        'app'
    ],
    function (app) {
        'use strict';

        var moduleUrl = 'app/components/transactions/transaction-edit/';

        app.config(
            [
                '$routeProvider',
                function ($routeProvider) {
                    $routeProvider
                        .when('/transactions/:id',
                        {
                            templateUrl: moduleUrl + 'transaction-edit.html',
                            controller: 'TransactionEditCtrl'
                        });
                }
            ]
        );

        return;
    }
);

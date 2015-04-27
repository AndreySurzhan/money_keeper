define(
    [
        'app',
        'text!./transactions-list.html'
    ],
    function (app, template) {
        'use strict';

        app.config(
            [
                '$routeProvider',
                function ($routeProvider) {
                    $routeProvider
                        .when('/transactions',
                        {
                            template: template,
                            controller: 'TransactionListCtrl'
                        });
                }
            ]
        );

        return;
    }
);

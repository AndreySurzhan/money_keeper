define(
    [
        'app',
        'text!./transaction-edit.html'
    ],
    function (app, template) {
        'use strict';

        app.config(
            [
                '$routeProvider',
                function ($routeProvider) {
                    $routeProvider
                        .when('/transactions/:id',
                        {
                            template: template,
                            controller: 'TransactionEditCtrl'
                        });
                }
            ]
        );

        return;
    }
);

define(
    [
        'app',
        'text!./currencies-list.html'
    ],
    function (app, template) {
        'use strict';

        app.config(
            [
                '$routeProvider',
                function ($routeProvider) {
                    $routeProvider
                        .when('/currencies',
                        {
                            template: template,
                            controller: 'CurrencyListCtrl'
                        });
                }
            ]
        );

        return;
    }
);

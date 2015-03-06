define(
    [
        'app'
    ],
    function (app) {
        'use strict';

        var moduleUrl = 'app/components/currencies/';

        app.config(
            [
                '$routeProvider',
                function ($routeProvider) {
                    $routeProvider
                        .when('/currencies',
                        {
                            templateUrl: moduleUrl + 'currencies-list.html',
                            controller: 'CurrencyListCtrl'
                        });
                }
            ]
        );

        return;
    }
);

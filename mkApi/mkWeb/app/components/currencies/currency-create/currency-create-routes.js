define(
    [
        'app'
    ],
    function (app) {
        'use strict';

        var moduleUrl = 'app/components/currencies/currency-create/';

        app.config(
            [
                '$routeProvider',
                function ($routeProvider) {
                    $routeProvider
                        .when('/currencies/add',
                        {
                            templateUrl: moduleUrl + 'currency-create.html',
                            controller: 'CurrencyCreateCtrl'
                        });
                }
            ]
        );

        return;
    }
);

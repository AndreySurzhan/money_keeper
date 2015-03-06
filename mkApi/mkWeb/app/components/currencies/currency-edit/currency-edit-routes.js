define(
    [
        'app'
    ],
    function (app) {
        'use strict';

        var moduleUrl = 'app/components/currencies/currency-edit/';

        app.config(
            [
                '$routeProvider',
                function ($routeProvider) {
                    $routeProvider
                        .when('/currencies/:id',
                        {
                            templateUrl: moduleUrl + 'currency-edit.html',
                            controller: 'CurrencyEditCtrl'
                        });
                }
            ]
        );

        return;
    }
);

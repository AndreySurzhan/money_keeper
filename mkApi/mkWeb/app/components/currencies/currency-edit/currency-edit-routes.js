define(
    [
        'app',
        'text!./currency-edit.html'
    ],
    function (app, template) {
        'use strict';

        app.config(
            [
                '$routeProvider',
                function ($routeProvider) {
                    $routeProvider
                        .when('/currencies/:id',
                        {
                            template: template,
                            controller: 'CurrencyEditCtrl'
                        });
                }
            ]
        );

        return;
    }
);

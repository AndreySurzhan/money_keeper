define(
    [
        'angular',
        'angular-route',
        'animations'
    ],
    function (ng) {
        'use strict';

        var app = ng.module(
            'app',
            [
                'ngRoute',
                'moneyKeeperControllers',
                'moneyKeeperFilters',
                'moneyKeeperServices',
                'moneyKeeperAnimations',
                'moneyKeeperTranslations'
            ]
        );

        app.config(
            [
                '$routeProvider',
                function ($routeProvider) {
                    $routeProvider
                        .otherwise({
                            redirectTo: '/'
                        });
                }
            ]
        );

        return app;
    }
);

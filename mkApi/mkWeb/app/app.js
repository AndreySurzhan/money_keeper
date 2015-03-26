define(
    [
        'angular',
        'angular-route',
        'angular-moment',
        'animations'
    ],
    function (ng) {
        'use strict';

        var app = ng.module(
            'app',
            [
                'ngRoute',
                'angularMoment',
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

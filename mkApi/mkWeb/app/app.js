define(
    [
        'angular',
        'json!./menu.json',
        'angular-route',
        'angular-moment',
        'angular-bootstrap',
        'animations',
        'angular-sortable'
    ],
    function (ng, menu) {
        'use strict';

        var app = ng.module(
            'app',
            [
                'ngRoute',
                'angularMoment',
                'ui.bootstrap',
                'ng-sortable',
                'moneyKeeperControllers',
                'moneyKeeperDirectives',
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

        app.controller(
            'mainController',
            [
                '$scope',
                function ($scope) {
                    $scope.menu = menu;
                }
            ]
        );

        return app;
    }
);

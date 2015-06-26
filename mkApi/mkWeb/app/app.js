define(
    [
        'angular',
        'json!./menu.json',
        'angular-route',
        'angular-moment',
        'angular-bootstrap',
        'animations',
        'angular-ui-tree'
    ],
    function (ng, menu) {
        'use strict';

        var app = ng.module(
            'app',
            [
                'ngRoute',
                'angularMoment',
                'ui.bootstrap',
                'ui.tree',
                'moneyKeeperControllers',
                'moneyKeeperDirectives',
                'moneyKeeperFilters',
                'moneyKeeperServices',
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

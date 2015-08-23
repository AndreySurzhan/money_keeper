define(
    [
        'angular',
        'json!./menu.json',
        './components/credit_calculator/credit-calculator',
        'angular-route',
        'angular-moment',
        'angular-bootstrap',
        'angular-ui-tree',
        'google-analytics'
    ],
    function (ng, menu, creditCalculatorModule) {
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
                'moneyKeeperTranslations',
                'angular-google-analytics'
            ]
        );

        app.config(
            [
                '$routeProvider',
                'AnalyticsProvider',
                function ($routeProvider, AnalyticsProvider) {
                    $routeProvider
                        .otherwise({
                            redirectTo: '/'
                        });

                    AnalyticsProvider.setAccount('UA-64888105-1');
                    AnalyticsProvider.trackPages(true);
                    AnalyticsProvider.trackUrlParams(true);
                    AnalyticsProvider.useDisplayFeatures(true);
                    AnalyticsProvider.useAnalytics(true);

                }
            ]
        );

        app.controller(
            'mainController',
            [
                '$scope',
                '$modal',
                function ($scope, $modal) {
                    $scope.menu = menu;
                    $scope.openCreditCalculator = openCreditCalculatorModal;

                    function openCreditCalculatorModal() {
                        var modalInstance = $modal.open({
                            animation: true,
                            template: creditCalculatorModule.template,
                            controller: creditCalculatorModule.controllerName,
                            windowClass: ['mkModalWindow']
                        });
                    }
                }
            ]
        );

        return app;
    }
);

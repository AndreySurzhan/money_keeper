define(
    [
        'angular'
    ],
    function (ng) {
        'use strict';

        var moneyKeeperControllers = ng.module(
            'moneyKeeperControllers',
            []
        );

        moneyKeeperControllers.controller(
            'CategoryDetailCtrl',
            [
                '$scope',
                '$routeParams',
                'Category',
                function ($scope, $routeParams, Category) {
                    $scope.category = Category.get(
                        {
                            categoryId: $routeParams.categoryId
                        },
                        function (category) {

                        }
                    );
                }
            ]
        );

        return moneyKeeperControllers;
    }
);

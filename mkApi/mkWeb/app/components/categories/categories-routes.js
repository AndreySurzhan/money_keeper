define(
    [
        'app'
    ],
    function (app) {
        'use strict';

        var moduleUrl = 'app/components/categories/';

        app.config(
            [
                '$routeProvider',
                function ($routeProvider) {
                    $routeProvider
                        .when('/categories',
                        {
                            templateUrl: moduleUrl + 'categories-list.html',
                            controller: 'CategoryListCtrl'
                        });
                }
            ]
        );

        return;
    }
);

define(
    [
        'app'
    ],
    function (app) {
        'use strict';

        var moduleUrl = 'app/components/categories/category-create/';

        app.config(
            [
                '$routeProvider',
                function ($routeProvider) {
                    $routeProvider
                        .when('/categories/add',
                        {
                            templateUrl: moduleUrl + 'category-create.html',
                            controller: 'CategoryCreateCtrl'
                        });
                }
            ]
        );

        return;
    }
);

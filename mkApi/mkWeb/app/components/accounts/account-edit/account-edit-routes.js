define(
    [
        'app'
    ],
    function (app) {
        'use strict';

        var moduleUrl = 'app/components/categories/category-edit/';

        app.config(
            [
                '$routeProvider',
                function ($routeProvider) {
                    $routeProvider
                        .when('/categories/:id',
                        {
                            templateUrl: moduleUrl + 'category-edit.html',
                            controller: 'CategoryEditCtrl'
                        });
                }
            ]
        );

        return;
    }
);

define(
    [
        'app',
        'text!./categories-list.html'
    ],
    function (app, template) {
        'use strict';

        app.config(
            [
                '$routeProvider',
                function ($routeProvider) {
                    $routeProvider
                        .when('/categories',
                        {
                            template: template,
                            controller: 'CategoryListCtrl'
                        });
                }
            ]
        );

        return;
    }
);

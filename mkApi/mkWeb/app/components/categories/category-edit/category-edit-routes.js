define(
    [
        'app',
        'text!./category-edit.html'
    ],
    function (app, template) {
        'use strict';

        app.config(
            [
                '$routeProvider',
                function ($routeProvider) {
                    $routeProvider
                        .when('/categories/:id',
                        {
                            template: template,
                            controller: 'CategoryEditCtrl'
                        });
                }
            ]
        );

        return;
    }
);

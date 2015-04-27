define(
    [
        'app',
        'text!./account-edit.html'
    ],
    function (app, template) {
        'use strict';

        app.config(
            [
                '$routeProvider',
                function ($routeProvider) {
                    $routeProvider
                        .when('/accounts/:id',
                        {
                            template: template,
                            controller: 'AccountEditCtrl'
                        });
                }
            ]
        );

        return;
    }
);

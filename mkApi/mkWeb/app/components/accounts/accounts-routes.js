define(
    [
        'app',
        'text!./accounts-list.html'
    ],
    function (app, template) {
        'use strict';

        app.config(
            [
                '$routeProvider',
                function ($routeProvider) {
                    $routeProvider
                        .when('/accounts',
                        {
                            template: template,
                            controller: 'AccountListCtrl'
                        });
                }
            ]
        );

        return;
    }
);

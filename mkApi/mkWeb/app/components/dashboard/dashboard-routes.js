define(
    [
        'app',
        'text!./dashboard-page.html'
    ],
    function (app, template) {
        'use strict';

        app.config(
            [
                '$routeProvider',
                function ($routeProvider) {
                    $routeProvider
                        .when('/',
                        {
                            template: template,
                            controller: 'DashboardCtrl'
                        });
                }
            ]
        );

        return;
    }
);

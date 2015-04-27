define(
    [
        'app'
    ],
    function (app) {
        'use strict';

        var moduleUrl = 'app/components/dashboard/';

        app.config(
            [
                '$routeProvider',
                function ($routeProvider) {
                    $routeProvider
                        .when('/',
                        {
                            templateUrl: moduleUrl + 'dashboard-page.html',
                            controller: 'DashboardCtrl'
                        });
                }
            ]
        );

        return;
    }
);

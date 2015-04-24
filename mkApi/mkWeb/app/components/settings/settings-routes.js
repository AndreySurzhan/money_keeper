define(
    [
        'app'
    ],
    function (app) {
        'use strict';

        var moduleUrl = 'app/components/settings/';

        app.config(
            [
                '$routeProvider',
                function ($routeProvider) {
                    $routeProvider
                        .when('/settings',
                        {
                            templateUrl: moduleUrl + 'settings-list.html',
                            controller: 'SettingsCtrl'
                        });
                }
            ]
        );

        return;
    }
);

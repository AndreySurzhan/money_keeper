define(
    [
        'app',
        'text!./settings-list.html'
    ],
    function (app, template) {
        'use strict';

        app.config(
            [
                '$routeProvider',
                function ($routeProvider) {
                    $routeProvider
                        .when('/settings',
                        {
                            template: template,
                            controller: 'SettingsCtrl'
                        });
                }
            ]
        );

        return;
    }
);

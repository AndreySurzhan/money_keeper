define(
    [
        'app'
    ],
    function (app) {
        'use strict';

        var moduleUrl = 'app/components/accounts/';

        app.config(
            [
                '$routeProvider',
                function ($routeProvider) {
                    $routeProvider
                        .when('/accounts',
                        {
                            templateUrl: moduleUrl + 'accounts-list.html',
                            controller: 'AccountListCtrl'
                        });
                }
            ]
        );

        return;
    }
);

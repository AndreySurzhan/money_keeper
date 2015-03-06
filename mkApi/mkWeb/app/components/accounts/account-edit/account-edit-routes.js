define(
    [
        'app'
    ],
    function (app) {
        'use strict';

        var moduleUrl = 'app/components/accounts/account-edit/';

        app.config(
            [
                '$routeProvider',
                function ($routeProvider) {
                    $routeProvider
                        .when('/accounts/:id',
                        {
                            templateUrl: moduleUrl + 'account-edit.html',
                            controller: 'AccountEditCtrl'
                        });
                }
            ]
        );

        return;
    }
);

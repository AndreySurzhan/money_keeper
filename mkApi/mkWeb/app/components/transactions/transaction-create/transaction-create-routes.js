define(
    [
        'app'
    ],
    function (app) {
        'use strict';

        var moduleUrl = 'app/components/accounts/account-create/';

        app.config(
            [
                '$routeProvider',
                function ($routeProvider) {
                    $routeProvider
                        .when('/accounts/add',
                        {
                            templateUrl: moduleUrl + 'account-create.html',
                            controller: 'AccountCreateCtrl'
                        });
                }
            ]
        );

        return;
    }
);

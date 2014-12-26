define(
    [
        'angular',
        'angular-resource'
    ],
    function (ng) {
        'use strict';

        var moneyKeeperServices = ng.module(
            'moneyKeeperServices',
            [
                'ngResource'
            ]
        );

        return moneyKeeperServices;
    }
);

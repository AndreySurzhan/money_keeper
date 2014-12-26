define(
    [
        'angular'
    ],
    function (ng) {
        'use strict';

        var moneyKeeperFilters = ng.module(
            'moneyKeeperFilters',
            []
        );

        moneyKeeperFilters.filter(
            'checkmark',
            function () {
                return function (input) {
                    return input ? '\u2713' : '\u2718';
                }
            }
        );



        return moneyKeeperFilters;
    }
);
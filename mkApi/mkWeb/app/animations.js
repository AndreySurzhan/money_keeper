define(
    [
        'angular',
        'angular-animate'
    ],
    function (ng) {
        'use strict';

        var moneyKeeperAnimations = ng.module(
            'moneyKeeperAnimations',
            [
                'ngAnimate'
            ]
        );

        return moneyKeeperAnimations
    }
);

define(
    [
        'angular',
        './common/directives/directives-form-controls',
        './common/directives/directives-validators'
    ],
    function (ng, formControls, validators) {
        'use strict';

        var i;
        var moneyKeeperDirectives = ng.module(
            'moneyKeeperDirectives',
            []
        );

        for (i = 0; i < formControls.length; i++) {
            moneyKeeperDirectives.directive(formControls[i].name, formControls[i].func);
        }

        for (i = 0; i < validators.length; i++) {
            moneyKeeperDirectives.directive(validators[i].name, validators[i].func);
        }

        return moneyKeeperDirectives;
    }
);

define(
    [
        'mkFilters'
    ],
    function (mkFilters) {
        'use strict';

        mkFilters.filter(
            'currencyName',
            function () {
                return function (currency) {
                    return currency ? currency.name : '';
                }
            }
        );

        return;
    }
);

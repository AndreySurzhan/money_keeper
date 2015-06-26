define(
    [
        'mkFilters',
        'text!./income.html',
        'text!./outcome.html'
    ],
    function (mkFilters, incomeHtml, outcomeHtml) {
        'use strict';

        mkFilters.filter(
            'parentCategoryName',
            function () {
                return function (parent) {
                    return parent ? parent.name : '-';
                }
            }
        );

        return;
    }
);

define(
    [
        'mkFilters'
    ],
    function (mkFilters) {
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

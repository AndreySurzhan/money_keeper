define(
    [
        'mkFilters'
    ],
    function (mkFilters) {
        'use strict';


        mkFilters.filter(
            'categoryName',
            function () {
                return function (category) {
                    return category ? category.name : '';
                }
            }
        );

        mkFilters.filter(
            'accountName',
            function () {
                return function (account) {
                    return account ? account.name : '';
                }
            }
        );


        return;
    }
);

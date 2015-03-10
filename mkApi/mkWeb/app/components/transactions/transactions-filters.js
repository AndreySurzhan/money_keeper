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

        mkFilters.filter(
            'transactionDate',
            function () {
                return function (dateStr) {
                    return new Date(dateStr);
                }
            }
        );


        return;
    }
);

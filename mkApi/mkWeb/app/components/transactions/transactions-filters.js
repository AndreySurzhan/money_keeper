define(
    [
        'mkFilters',
        'json!enums',
        'text!./arrow.html'
    ],
    function (mkFilters, enums, arrowHtml) {
        'use strict';


        mkFilters.filter(
            'transactionCategory',
            [
                '$sce',
                function ($sce) {
                    return function (transaction) {
                        var accountDestinationName;

                        if (transaction.type !== enums.transactionTypes.transfer.value) {
                            return $sce.trustAsHtml(transaction.category ? transaction.category.name : '');
                        }

                        // if transfer
                        accountDestinationName = transaction.accountDestination ? transaction.accountDestination.name : '';

                        if (!accountDestinationName) {
                            return $sce.trustAsHtml('');
                        }

                        return $sce.trustAsHtml(arrowHtml + accountDestinationName);
                    }
                }
            ]
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
                    var date = new Date(dateStr);

                    return date;
                }
            }
        );

        return;
    }
);

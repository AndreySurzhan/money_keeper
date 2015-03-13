define(
    [
        'mkControllers',
        './transactions-services'
    ],
    function (mkControllers) {
        mkControllers.controller(
            'TransactionListCtrl',
            [
                '$scope',
                'Transaction',
                function ($scope, Transaction) {
                    Transaction.query(function (transactions) {
                        $scope.transactions = transactions;
                        console.log('transactions', transactions);
                    });
                    $scope.orderProp = '_id';

                    $scope.showDetails = function (transactiontId) {
                        console.log('showDetails');
                        console.log(transactiontId);

                        window.location.hash = '#/transactions/' + transactiontId;
                    };

                    $scope.remove = function (transactiontId) {
                        Transaction.remove(
                            {
                                id: transactiontId
                            },
                            function (transactions) {
                                $scope.transactions = transactions;
                            },
                            function () {
                                console.error('error', arguments);
                            }
                        );
                    };
                }
            ]
        );

        return;
    }
);

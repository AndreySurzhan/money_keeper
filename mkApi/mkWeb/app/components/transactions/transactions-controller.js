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
                    $scope.transactions = Transaction.query();
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

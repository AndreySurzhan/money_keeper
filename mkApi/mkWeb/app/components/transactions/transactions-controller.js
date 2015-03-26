define(
    [
        'json!config',
        'mkControllers',
        'logger',
        './transactions-services'
    ],
    function (config, mkControllers, logger) {
        mkControllers.controller(
            'TransactionListCtrl',
            [
                '$scope',
                'Transaction',
                'amMoment',
                function ($scope, Transaction, amMoment) {
                    logger.log('--- Transaction List controller initialize');

                    amMoment.changeLocale(config.lang);
                    logger.log('Getting transactions list...');
                    logger.time('Getting transactions list');
                    Transaction.query(
                        function (transactions) {
                            logger.timeEnd('Getting transactions list');
                            logger.logTransactions(transactions);

                            $scope.transactions = transactions;

                        },
                        function () {
                            logger.timeEnd('Getting transactions list');
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

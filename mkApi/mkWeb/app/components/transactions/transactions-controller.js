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
                '$filter',
                'Transaction',
                'amMoment',
                function ($scope, $filter, Transaction, amMoment) {
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


                    // ---------------

                    console.log(1);

                    $scope.pagination = {
                        totalItems: 64,
                        currentPage: 1,
                        itemsPerPage: 10,
                        maxSize: 5,

                        start: 1,
                        end: 10
                    };

                    $scope.pagination.status = $filter('translate')('common.lists.pager.shown', {
                        from: $scope.pagination.start,
                        to: $scope.pagination.end,
                        total: $scope.pagination.totalItems
                    });

                    $scope.pageChanged = function() {
                        logger.log('Page changed to: ' + $scope.pagination.currentPage);

                        $scope.pagination.start = ($scope.pagination.currentPage - 1) * $scope.pagination.itemsPerPage + 1;
                        $scope.pagination.end = $scope.pagination.start + $scope.pagination.itemsPerPage - 1;


                        $scope.pagination.status = $filter('translate')('common.lists.pager.shown', {
                            from: $scope.pagination.start,
                            to: $scope.pagination.end ,
                            total: $scope.pagination.totalItems
                        });
                    };


                }
            ]
        );

        return;
    }
);

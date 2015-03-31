define(
    [
        'json!config',
        'mkControllers',
        'logger',
        'jquery',
        'json!config',
        './transactions-services'
    ],
    function (config, mkControllers, logger, $, config) {

        // Transactions

        var updateTransactionsList = function (transactionsFactory, page, perPage) {
            var result = new $.Deferred();

            transactionsFactory.query(
                {
                    page: page,
                    perPage: perPage
                },
                function (transactions) {
                    result.resolve(transactions);
                },
                function (error) {
                    result.reject(error);
                }
            );

            return result.promise();
        };

        // Pagination

        var getPaginationStatus = function (pagination, $filter) {
            return $filter('translate')('common.lists.pager.shown', {
                from: pagination.start,
                to: Math.min(pagination.end, pagination.totalItems),
                total: pagination.totalItems
            });
        };

        var getInitPagination = function (paginationConfig, $filter) {
            var pagination = {
                maxSize: paginationConfig.maxSize,
                itemsPerPage: paginationConfig.itemsPerPage,
                currentPage: 1,
                totalItems: 0,
                start: 0,
                end: 0
            };

            pagination.status = getPaginationStatus(pagination, $filter);

            return pagination;
        };

        var updatePagination = function (pagination, data, $filter) {
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    pagination[key] = data[key];
                }
            }

            pagination.status = getPaginationStatus(pagination, $filter);

            return pagination;
        };

        // Events

        var onPaginationChanged = function ($scope, $filter, transactionsFactory) {
            return function () {
                var pagination = $scope.pagination;

                pagination = updatePagination(
                    pagination,
                    {
                        start: (pagination.currentPage - 1) * pagination.itemsPerPage + 1,
                        end: pagination.currentPage * pagination.itemsPerPage
                    },
                    $filter
                );

                updateTransactionsList(transactionsFactory, $scope.pagination.currentPage, $scope.pagination.itemsPerPage)
                    .done(function (transactions) {
                        $scope.transactions = transactions;
                        $scope.pagination = updatePagination(
                            $scope.pagination,
                            {
                                totalItems: transactions.total
                            },
                            $filter
                        );
                    })
                    .fail(function (error) {

                    });
            };
        };

        mkControllers.controller(
            'TransactionListCtrl',
            [
                '$scope',
                '$filter',
                'Transaction',
                'amMoment',
                function ($scope, $filter, Transaction, amMoment) {
                    amMoment.changeLocale(config.lang);

                    $scope.pageSizes = config.pagination.pageSizes;
                    $scope.pagination = getInitPagination(
                        {
                            maxSize: config.pagination.pagesInRow,
                            itemsPerPage: config.pagination.pageSizeDefault
                        },
                        $filter
                    );

                    updateTransactionsList(Transaction, $scope.pagination.currentPage, $scope.pagination.itemsPerPage)
                        .done(function (transactions) {
                            $scope.transactions = transactions;
                            $scope.pagination = updatePagination(
                                $scope.pagination,
                                {
                                    start: ($scope.pagination.currentPage - 1) * $scope.pagination.itemsPerPage + 1,
                                    end: $scope.pagination.currentPage * $scope.pagination.itemsPerPage,
                                    totalItems: transactions.total
                                },
                                $filter
                            );
                        })
                        .fail(function (error) {

                        });

                    $scope.orderProp = '_id';
                    $scope.showDetails = function (transactiontId) {
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

                    $scope.onPageChanged = onPaginationChanged($scope, $filter, Transaction);
                    $scope.onPageSizeChanged = onPaginationChanged($scope, $filter, Transaction);
                }
            ]
        );

        return;
    }
);

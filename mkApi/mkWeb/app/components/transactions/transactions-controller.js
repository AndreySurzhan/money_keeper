define(
    [
        'json!config',
        'mkControllers',
        'logger',
        'jquery',
        'json!config',
        './transaction-edit/transaction-edit',
        './transaction-import/transaction-import',
        './transactions-services'
    ],
    function (config, mkControllers, logger, $, config, editController, importController) {

        // Transactions

        var updateTransactionsList = function (transactionsFactory, page, perPage) {
            logger.time('Updating transactions list');

            var result = new $.Deferred();

            transactionsFactory.query(
                {
                    page: page,
                    perPage: perPage
                },
                function (transactions) {
                    logger.timeEnd('Updating transactions list');
                    logger.groupCollapsed('Updating transactions list');
                    logger.logTransactions(transactions);
                    logger.groupEnd('Updating transactions list');

                    result.resolve(transactions);
                },
                function (error) {
                    logger.timeEnd('Updating transactions list');
                    logger.error(error);

                    result.reject(error);
                }
            );

            return result.promise();
        };

        // Modal window

        var openTransactionEditModalWindow = function ($modal, operation, id) {
            var result = new $.Deferred();
            var modalInstance = $modal.open({
                animation: true,
                template: editController.template,
                controller: editController.name,
                windowClass : ['mkModalWindow transactionEditWindow'],
                resolve: {
                    transactionId: function () {
                        return operation === 'add' ? 'add' : id;
                    }
                }
            });

            modalInstance.result.then(function (transaction) {
                result.resolve(transaction);
            }, function () {
                result.reject();
            });

            return result.promise();
        };

        var openImportModalWindow = function ($modal, source) {
            var result = new $.Deferred();
            var modalInstance = $modal.open({
                animation: true,
                template: importController.template,
                controller: importController.name,
                windowClass : ['mkModalWindow transactionImportWindow'],
                resolve: {
                    importSource: function () {
                        return source;
                    }
                }
            });

            modalInstance.result.then(function (transaction) {
                result.resolve(transaction);
            }, function () {
                result.reject();
            });

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

        var refreshTransactionsList = function ($scope, $filter, transactionsFactory) {
            return function () {
                var pagination = $scope.pagination;

                $scope.isUpdating = true;

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
                        $scope.isUpdating = false;
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
                        $scope.isUpdating = false;
                        logger.error(error);
                    });
            };
        };

        mkControllers.controller(
            'TransactionListCtrl',
            [
                '$scope',
                '$filter',
                '$modal',
                'Transaction',
                'amMoment',
                function ($scope, $filter, $modal, Transaction, amMoment) {
                    logger.info('--- Transaction List controller initialize ---');
                    logger.time('Transaction List controller initialize');

                    amMoment.changeLocale(config.lang);

                    $scope.isUpdating = false;
                    $scope.isImportPanelVisibile = false;
                    $scope.pageSizes = config.pagination.pageSizes;
                    $scope.pagination = getInitPagination(
                        {
                            maxSize: config.pagination.pagesInRow,
                            itemsPerPage: config.pagination.pageSizeDefault
                        },
                        $filter
                    );

                    $scope.isUpdating = true;
                    updateTransactionsList(Transaction, $scope.pagination.currentPage, $scope.pagination.itemsPerPage)
                        .done(function (transactions) {
                            logger.timeEnd('Transaction List controller initialize');

                            $scope.isUpdating = false;
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
                            logger.timeEnd('Transaction List controller initialize');
                            logger.error(error);

                            $scope.isUpdating = false;
                        });

                    $scope.orderProp = '_id';

                    $scope.refresh = refreshTransactionsList($scope, $filter, Transaction);
                    $scope.addNewTransaction = function () {
                        openTransactionEditModalWindow($modal, 'add').done(function () {
                            $scope.refresh();
                        });
                    };
                    $scope.editTransaction = function (transactiontId) {
                        openTransactionEditModalWindow($modal, 'edit', transactiontId).done(function () {
                            $scope.refresh();
                        });
                    };
                    $scope.remove = function (transactiontId) {
                        logger.log('Remove transaction #' + transactiontId);

                        Transaction.remove(
                            {
                                id: transactiontId
                            },
                            function (transactions) {
                                logger.log('Transactions removed');

                                $scope.transactions = transactions;
                            },
                            function (error) {
                                logger.error(error);
                            }
                        );
                    };
                    $scope.toggleImportPanel = function () {
                        $scope.isImportPanelVisibile = !$scope.isImportPanelVisibile;
                    };
                    $scope.importFromEasyfinance = function () {
                        openImportModalWindow($modal, 'easyfinance').done(function () {
                            $scope.refresh();
                        });
                    };

                    $scope.onPageChanged = refreshTransactionsList($scope, $filter, Transaction);
                    $scope.onPageSizeChanged = refreshTransactionsList($scope, $filter, Transaction);
                }
            ]
        );

        return;
    }
);

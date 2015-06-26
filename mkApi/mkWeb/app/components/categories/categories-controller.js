define(
    [
        'mkControllers',
        'logger',
        'jquery',
        './categories-services'
    ],
    function (mkControllers, logger, $) {
        var sortableOptions = {
            animation: 150,
            group: {
                name: 'income',
                put: ['income']
            }
        };

        var makeTree = function (currentNode, categories, income) {
            var i;
            var children;
            var tree;

            logger.groupCollapsed('processing ' + (currentNode.name || currentNode._id));

            children = getCategoriesByParentId(categories, currentNode._id, income);

            logger.log('children', children);

            if (children.length > 0) {
                currentNode.children = children;

                for (i = 0; i < children.length; i++) {
                    children[i].id = children[i]._id;
                    makeTree(children[i], categories, income);
                }
            }

            logger.groupEnd('processing ' + (currentNode.name || currentNode._id));

            return currentNode;

            function getCategoriesByParentId (categories, parentId, income) {
                var i;
                var index;
                var result = [];

                for (i = 0; i < categories.length; i++) {
                    if (
                        categories[i].income === income &&
                        (
                            (_.isNull(categories[i].parent) && parentId === 'root') ||
                            (!_.isNull(categories[i].parent) && categories[i].parent._id === parentId)
                        )
                    ) {
                        result.push(categories[i]);
                    }
                }

                return result;
            }
        };

        var updateCategoriesList = function ($scope, categoriesFactory, categories) {
            var result = new $.Deferred();

            if (categories) {
                result.resolve(prepareResult(categories));

                return result.promise();
            }

            logger.time('Updating categories list');
            $scope.isUpdating = true;
            categoriesFactory.query(
                function (categories) {
                    logger.timeEnd('Updating categories list');
                    logger.groupCollapsed('Updating categories list');
                    logger.logCategories(categories);
                    logger.groupEnd('Updating categories list');

                    $scope.isUpdating = false;

                    result.resolve(prepareResult(categories));
                },
                function (error) {
                    logger.error(error);
                    $scope.isUpdating = false;
                    result.reject(error);
                }
            );

            return result.promise();

            function prepareResult(categories) {
                var result = {};

                result.income = makeTree({
                    _id: 'root'
                }, categories, true).children;

                result.outcome = makeTree({
                    _id: 'root'
                }, categories, false).children;

                return result;
            }
        };

        mkControllers.controller(
            'CategoryListCtrl',
            [
                '$scope',
                'Category',
                function ($scope, Category) {
                    $scope.categoriesTree = {};

                    updateCategoriesList($scope, Category)
                        .done(function (categoriesTree) {
                            $scope.categoriesTree = categoriesTree;
                        })
                        .fail(function (error) {
                            $scope.categories = [];
                        });

                    $scope.treeOptions = {
                        accept: function(sourceNodeScope, destNodesScope, destIndex) {
                            return true;

                            if (!destNodesScope.$parent.$modelValue) {
                                return destNodesScope.$modelValue.income === sourceNodeScope.$modelValue.income;
                            }

                            return sourceNodeScope.$modelValue.income === destNodesScope.$parent.$modelValue.income;
                        },
                        dropped: function(e) {
                            console.log('dropped');
                            console.log('source', e.source.nodeScope.$modelValue);//);
                            console.log('dest', e.dest.nodesScope.$parent.$modelValue);//.nodeScope.$modelValue);
                        }
                    };

                    $scope.refresh = function () {
                        updateCategoriesList($scope, Category)
                            .done(function (categoriesTree) {
                                $scope.categoriesTree = categoriesTree;
                            })
                            .fail(function (error) {
                                $scope.categories = [];
                            });
                    };

                    $scope.editCategory = function (treeNodeScope) {
                        console.info(treeNodeScope.$modelValue._id);

                        return;
                    };

                    $scope.removeCategory = function (treeNodeScope) {
                        var categoryId = treeNodeScope.$modelValue._id;

                        Category.remove(
                            {
                                id: categoryId
                            },
                            function (categories) {
                                updateCategoriesList($scope, Category, categories)
                                    .done(function (categoriesTree) {
                                        $scope.categoriesTree = categoriesTree;
                                    })
                                    .fail(function (error) {
                                        $scope.categories = [];
                                    });
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

define(
    [
        'mkControllers',
        './category-edit/category-edit',
        'logger',
        'jquery',
        './categories-services'
    ],
    function (mkControllers, editController, logger, $) {
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

        var updateCategory = function (categoriesFactory, categoryId, parentId) {
            var result = new $.Deferred();

            categoriesFactory.update(
                {
                    id: categoryId
                },
                {
                    parent: parentId
                },
                function (category) {
                    result.resolve(category);
                },
                function (error) {
                    result.reject(error);
                }
            );

            return result.promise();
        };

        // Modal window

        var openModalWindow = function ($modal, operation, id) {
            var result = new $.Deferred();
            var modalInstance = $modal.open({
                animation: true,
                template: editController.template,
                controller: editController.name,
                windowClass : ['mkModalWindow categoryEditWindow'],
                resolve: {
                    categoryId: function () {
                        return operation === 'add' ? 'add' : id;
                    }
                }
            });

            modalInstance.result.then(function (category) {
                result.resolve(category);
            }, function () {
                result.reject();
            });

            return result.promise();
        };

        mkControllers.controller(
            'CategoryListCtrl',
            [
                '$scope',
                '$modal',
                'Category',
                function ($scope, $modal, Category) {
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
                            var sourceNodeIncome = sourceNodeScope.$modelValue.income;

                            if (!destNodesScope.$modelValue[0]) {
                                return true;
                            }

                            return sourceNodeIncome === destNodesScope.$modelValue[0].income;

                        },
                        dropped: function(e) {
                            var currentCategoryId;
                            var parentCategoryId;

                            currentCategoryId = e.source.nodeScope.$modelValue._id;
                            parentCategoryId = e.dest.nodesScope.$parent.$modelValue ?
                                e.dest.nodesScope.$parent.$modelValue._id :
                                null;

                            return;

                            updateCategory(Category, currentCategoryId, parentCategoryId);
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

                    $scope.addNewCategory = function () {
                        openModalWindow($modal, 'add').done(function () {
                            $scope.refresh();
                        });
                    };

                    $scope.editCategory = function (treeNodeScope) {
                        var categoryId = treeNodeScope.$modelValue._id;

                        openModalWindow($modal, 'edit', categoryId).done(function () {
                            $scope.refresh();
                        });

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

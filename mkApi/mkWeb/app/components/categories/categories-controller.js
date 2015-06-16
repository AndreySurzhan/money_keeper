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

        var makeTree = function (currentNode, categories) {
            var i;
            var children;
            var tree;

            logger.groupCollapsed('processing ' + (currentNode.name || currentNode._id));

            children = getCategoriesByParentId(categories, currentNode._id);

            logger.log('children', children);

            if (children.length > 0) {
                currentNode.children = children;

                for (i = 0; i < children.length; i++) {
                    children[i].id = children[i]._id;
                    makeTree(children[i], categories);
                }
            }

            logger.groupEnd('processing ' + (currentNode.name || currentNode._id));

            return currentNode;

            function getCategoriesByParentId (categories, parentId) {
                var i;
                var index;
                var result = [];

                for (i = 0; i < categories.length; i++) {
                    if (
                        (_.isNull(categories[i].parent) && parentId === 'root') ||
                        (!_.isNull(categories[i].parent) && categories[i].parent._id === parentId)
                    ) {
                        result.push(categories[i]);
                    }
                }

                return result;
            }
        };

        var updateCategoriesList = function ($scope, categoriesFactory, categories) {
            var categoriesTree;
            var result = new $.Deferred();

            if (categories) {
                categoriesTree = makeTree({
                    _id: 'root'
                }, categories);

                result.resolve(categoriesTree.children);
            } else {
                logger.time('Updating categories list');
                $scope.isUpdating = true;
                categoriesFactory.query(
                    function (categories) {
                        logger.timeEnd('Updating categories list');
                        logger.groupCollapsed('Updating categories list');
                        logger.logCategories(categories);
                        logger.groupEnd('Updating categories list');

                        $scope.isUpdating = false;

                        categoriesTree = makeTree({
                            _id: 'root'
                        }, categories);

                        result.resolve(categoriesTree.children);
                    },
                    function (error) {
                        logger.error(error);
                        $scope.isUpdating = false;
                        result.reject(error);
                    }
                );
            }

            return result.promise();
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
                            console.log('accept');
                            console.log (sourceNodeScope);
                            console.log (destNodesScope);
                            console.log (destIndex);
                            return true;
                        },
                        dropped: function(e) {
                            console.log('dropped');
                            console.log(e.source.nodeScope.$modelValue);
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

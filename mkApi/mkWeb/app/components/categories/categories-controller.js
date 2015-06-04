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
            handle: '.grad-handle'
        };

        var makeTree = function (currentNode, categories) {
            console.log(categories);

            var i;
            var lastList;
            var tree;

            lastList = getCategoriesByParentId(categories, 'root');
            tree = lastList;

            for (i = 0; i < tree.length; i++) {

            }

            return tree;

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

                for (i = 0; i < result.length; i++) {
                    index = _.indexOf(categories, result[i]);

                    if (index > -1) {
                        categories.splice(index, 1);
                    }
                }

                return result;
            }
        };

        var updateCategoriesList = function ($scope, categoriesFactory) {
            var categoriesTree;
            var result = new $.Deferred();

            logger.time('Updating categories list');

            $scope.isUpdating = true;

            categoriesFactory.query(
                function (categories) {
                    logger.timeEnd('Updating categories list');
                    logger.groupCollapsed('Updating categories list');
                    logger.logCategories(categories);
                    logger.groupEnd('Updating categories list');

                    $scope.isUpdating = false;

                    categoriesTree = makeTree(categories);

                    result.resolve(categoriesTree);
                },
                function (error) {
                    logger.error(error);
                    $scope.isUpdating = false;
                    result.reject(error);
                }
            );

            return result.promise();
        };

        mkControllers.controller(
            'CategoryListCtrl',
            [
                '$scope',
                'Category',
                function ($scope, Category) {
                    $scope.categories = [];
                    $scope.orderProp = '_id';
                    $scope.sortableOptions = sortableOptions;

                    updateCategoriesList($scope, Category)
                        .done(function (categories) {
                            $scope.categories = categories
                        })
                        .fail(function (error) {
                            $scope.categories = [];
                        });

                    $scope.refresh = function () {
                        updateCategoriesList($scope, Category)
                            .done(function (categories) {
                                $scope.categories = categories
                            })
                            .fail(function (error) {
                                $scope.categories = [];
                            });
                    };

                    $scope.showDetails = function (categoryId) {
                        console.log('showDetails');
                        console.log(categoryId);

                        window.location.hash = '#/categories/' + categoryId;
                    };

                    $scope.remove = function (categoryId) {
                        Category.remove(
                            {
                                id: categoryId
                            },
                            function (categories) {
                                $scope.categories = categories;
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

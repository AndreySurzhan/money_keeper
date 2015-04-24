define(
    [
        'mkControllers',
        'logger',
        'jquery',
        './categories-services'
    ],
    function (mkControllers, logger, $) {
        var updateCategoriesList = function ($scope, categoriesFactory) {
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
                    result.resolve(categories);
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

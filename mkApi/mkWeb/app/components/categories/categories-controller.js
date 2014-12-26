define(
    [
        'mkControllers',
        './categories-services'
    ],
    function (mkControllers) {
        mkControllers.controller(
            'CategoryListCtrl',
            [
                '$scope',
                'Category',
                function ($scope, Category) {

                    $scope.categories = Category.query();
                    $scope.orderProp = '_id';

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

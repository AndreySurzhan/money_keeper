define(
    [
        'mkControllers',
        '../categories-services'
    ],
    function (mkControllers) {
        mkControllers.controller(
            'CategoryEditCtrl',
            [
                '$scope',
                '$routeParams',
                'Category',
                function ($scope, $routeParams, Category) {
                    $scope.selectParentData = [];
                    $scope.submitDisabled = true;


                    $scope.id = $routeParams.id;
                    Category.get(
                        {
                            id: $scope.id
                        },
                        function (category) {
                            $scope.name = category.name;
                            $scope.income = category.income;
                            $scope.parentId = category.parent ? category.parent._id : 0;

                            $scope.incomeChanged()
                        },
                        function () {
                            console.log('error', arguments);
                        }
                    );


                    $scope.incomeChanged = function () {
                        var errorHandler = function (err) {
                            $scope.selectParentDisabled = false;
                            $scope.submitDisabled = false;
                            console.error(err);
                        };
                        var successHandler = function (categories) {
                            $scope.selectParentDisabled = false;
                            $scope.submitDisabled = false;
                            $scope.selectParentData = categories;


                            for (var i = 0; i < categories.length; i++) {
                                if (categories[i]._id === $scope.parentId) {
                                    $scope.parent = categories[i];
                                    break;
                                }
                            }

                            console.log('parent categories', categories);
                        };

                        console.log('incomeChanged');

                        $scope.selectParentDisabled = true;

                       if ($scope.income) {
                           Category.getIncome(successHandler, errorHandler);
                       } else {
                           Category.getOutcome(successHandler, errorHandler);
                       }

                    };

                    $scope.editCategory = function () {
                        console.log('editCategory');
                        var parentId = typeof $scope.parent === 'object' ? $scope.parent._id : $scope.parent;

                        Category.update(
                            {
                                'id': $scope.id
                            },
                            {
                                'name': $scope.name,
                                'income': $scope.income,
                                'parent': parentId
                            }, function () {
                                window.history.back();
                            }, function (error) {
                                console.log(0);
                                console.err(error);
                            }
                        );

                        /*
                        $scope.submitDisabled = true;



                        console.log('-------- addCategory --------');
                        console.log(arguments);
                        console.log('name:', $scope.name);
                        console.log('income:', $scope.income);
                        console.log('parent:', $scope.parent);



                        */
                    };

                    $scope.Cancel = function () {
                        window.history.back();
                    };
                }
            ]
        );

        return;
    }
);

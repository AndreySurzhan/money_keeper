define(
    [
        'mkControllers',
        '../categories-services'
    ],
    function (mkControllers) {
        mkControllers.controller(
            'CategoryCreateCtrl',
            [
                '$scope',
                'Category',
                function ($scope, Category) {
                    $scope.selectParentData = [];

                    $scope.submitDisabled = false;

                    $scope.name = '';
                    $scope.income = false;
                    $scope.parent = 0;

                    $scope.incomeChanged = function () {
                        var errorHandler = function (err) {
                            $scope.selectParentDisabled = false;
                            console.error(err);
                        };
                        var successHandler = function (categories) {
                            $scope.selectParentDisabled = false;
                            $scope.selectParentData = categories;

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

                    $scope.incomeChanged();

                    $scope.addCategory = function () {
                        $scope.submitDisabled = true;

                        $scope.parent = typeof $scope.parent === 'object' ? $scope.parent._id : $scope.parent;

                        console.log('-------- addCategory --------');
                        console.log(arguments);
                        console.log('name:', $scope.name);
                        console.log('income:', $scope.income);
                        console.log('parent:', $scope.parent);


                        Category.save({
                                'name': $scope.name,
                                'income': $scope.income,
                                'parent': $scope.parent
                            }, function () {
                                window.history.back();
                            }, function (error) {
                                console.log(0);
                                console.err(error);
                            }
                        );
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

define(
    [
        'mkControllers',
        '../currencies-services'
    ],
    function (mkControllers) {
        mkControllers.controller(
            'CurrencyEditCtrl',
            [
                '$scope',
                '$routeParams',
                'Currency',
                function ($scope, $routeParams, Currency) {
                    $scope.submitDisabled = true;

                    $scope.id = $routeParams.id;
                    Currency.get(
                        {
                            id: $scope.id
                        },
                        function (category) {
                            $scope.name = category.name;
                            $scope.submitDisabled = false;
                        },
                        function () {
                            console.log('error', arguments);
                        }
                    );

                    $scope.editCurrency = function () {
                        console.log('editCurrency');

                        Currency.update(
                            {
                                'id': $scope.id
                            },
                            {
                                'name': $scope.name
                            }, function () {
                                window.history.back();
                            }, function (error) {
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

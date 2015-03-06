define(
    [
        'mkControllers',
        '../currencies-services'
    ],
    function (mkControllers) {
        mkControllers.controller(
            'CurrencyCreateCtrl',
            [
                '$scope',
                'Currency',
                function ($scope, Currency) {
                    $scope.submitDisabled = false;
                    $scope.name = '';

                    $scope.addCurrency = function () {
                        $scope.submitDisabled = true;

                        console.log('-------- addCurrency --------');
                        console.log('name:', $scope.name);

                        Currency.save({
                                'name': $scope.name,
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

define(
    [
        'mkControllers'
    ],
    function (mkControllers) {
        mkControllers.controller(
            'creditCalculator',
            [
                '$scope',
                function ($scope) {
                    $scope.amount = "10";
                    $scope.interestRate = "30";
                    $scope.numberOfMonth = "40";
                    $scope.monthlyPayment = "50";
                    $scope.overPayment = "";

                    function calculation (amoun, interestRate, numberOfYears, monthlyPayment) {
                        $scope.creditOverPayment = amoun + interestRate + numberOfYears + monthlyPayment;
                    }

                    calculation($scope.amount, $scope.interestRate, $scope.numberOfMonth, $scope.monthlyPayment);



                }
        ]);
        return 'creditCalculator';
    });

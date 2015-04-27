define(
    [
        'json!config',
        'mkControllers',
        'logger',
        './dashboard-services'
    ],
    function (config, mkControllers, logger) {
        mkControllers.controller(
            'DashboardCtrl',
            [
                '$scope',
                'Dashboard',
                function ($scope, dashboardFactory) {
                    dashboardFactory.get(
                        function (dashboardData) {
                            console.log('dashboardData', dashboardData);

                            $scope.total = dashboardData.total;
                        },
                        function (error) {
                            console.error(error);
                        }
                    );

                }
            ]
        );

        return;
    }
);

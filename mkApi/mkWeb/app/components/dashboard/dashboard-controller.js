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
                            $scope.total = dashboardData.total;
                        },
                        function (error) {
                            logger.error(error);
                        }
                    );

                }
            ]
        );

        return;
    }
);

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
                'Analytics',
                function ($scope, dashboardFactory, Analytics) {
                    Analytics.trackPage('/dashboard');

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

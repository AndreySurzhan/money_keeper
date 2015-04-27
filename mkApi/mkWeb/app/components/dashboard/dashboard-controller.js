define(
    [
        'json!config',
        'mkControllers',
        'logger'
    ],
    function (config, mkControllers, logger) {
        mkControllers.controller(
            'DashboardCtrl',
            [
                '$scope',
                function ($scope) {

                }
            ]
        );

        return;
    }
);

define(
    [
        'json!config',
        'mkControllers',
        'logger'
    ],
    function (config, mkControllers, logger) {
        mkControllers.controller(
            'SettingsCtrl',
            [
                '$scope',
                function ($scope) {

                }
            ]
        );

        return;
    }
);

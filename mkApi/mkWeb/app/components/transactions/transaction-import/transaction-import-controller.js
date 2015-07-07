define(
    [
        'mkControllers',
        'json!enums',
        'json!config',
        'underscore',
        'jquery',
        'logger'
    ],
    function (mkControllers, enums, config, _, $, logger) {
        var controllerName = 'TransactionEditCtrl';

        mkControllers.controller(
            controllerName,
            [
                '$scope',
                '$modalInstance',
                'importSource',
                function ($scope, $modalInstance, importSource) {
                    logger.info('--- Import Transaction controller initialize ---');
                }
            ]
        );

        return controllerName;
    }
);

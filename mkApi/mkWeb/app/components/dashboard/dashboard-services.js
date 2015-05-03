define(
    [
        'mkServices',
        'json!config'
    ],
    function (mkServices, config) {
        'use strict';

        mkServices.factory(
            'Dashboard',
            [
                '$resource',
                function ($resource) {
                    var resource = $resource(
                        config.api + 'dashboard/',
                        {},
                        {
                            get: {
                                method: 'GET',
                                url: config.api + 'dashboard/',
                                isArray: false
                            }
                        });

                    return resource;
                }
            ]
        );

        return;
    }
);

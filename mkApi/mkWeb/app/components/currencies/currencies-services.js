define(
    [
        'mkServices',
        'json!config'
    ],
    function (mkServices, config) {
        'use strict';

        mkServices.factory(
            'Currency',
            [
                '$resource',
                function ($resource) {
                    var resource = $resource(
                        config.api + 'currencies/',
                        {},
                        {
                            get: {
                                method: 'GET',
                                url: config.api + 'currencies/:id'
                            },
                            update: {
                                method: 'PUT',
                                url: config.api + 'currencies/:id'
                            },
                            remove: {
                                method: 'DELETE',
                                url: config.api + 'currencies/:id',
                                isArray: true
                            }
                        });

                    return resource;
                }
            ]
        );

        return;
    }
);

define(
    [
        'mkServices',
        'json!config'
    ],
    function (mkServices, config) {
        'use strict';

        mkServices.factory(
            'Account',
            [
                '$resource',
                function ($resource) {
                    var resource = $resource(
                        config.api + 'accounts/',
                        {},
                        {
                            get: {
                                method: 'GET',
                                url: config.api + 'accounts/:id'
                            },
                            update: {
                                method: 'PUT',
                                url: config.api + 'accounts/:id'
                            },
                            remove: {
                                method: 'DELETE',
                                url: config.api + 'accounts/:id',
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

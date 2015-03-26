define(
    [
        'mkServices',
        'json!config'
    ],
    function (mkServices, config) {
        'use strict';

        mkServices.factory(
            'Transaction',
            [
                '$resource',
                function ($resource) {
                    var resource = $resource(
                        config.api + 'transactions/',
                        {},
                        {
                            get: {
                                method: 'GET',
                                url: config.api + 'transactions/:id'
                            },
                            update: {
                                method: 'PUT',
                                url: config.api + 'transactions/:id'
                            },
                            remove: {
                                method: 'DELETE',
                                url: config.api + 'transactions/:id',
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

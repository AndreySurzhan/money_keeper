define(
    [
        'mkServices',
        'json!config'
    ],
    function (mkServices, config) {
        'use strict';

        mkServices.factory(
            'Category',
            [
                '$resource',
                function ($resource) {
                    var resource = $resource(
                        config.api + 'categories/',
                        {},
                        {
                            get: {
                                method: 'GET',
                                url: config.api + 'categories/:id'
                            },
                            getIncome: {
                                method: 'GET',
                                url: config.api + 'categories/income',
                                isArray: true
                            },
                            getOutcome: {
                                method: 'GET',
                                url: config.api + 'categories/outcome',
                                isArray: true
                            },
                            update: {
                                method: 'PUT',
                                url: config.api + 'categories/:id'
                            },
                            remove: {
                                method: 'DELETE',
                                url: config.api + 'categories/:id',
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

define(
    [
        'angular',
        'mkServices',
        'json!config'
    ],
    function (angular, mkServices, config) {
        'use strict';

        mkServices.factory(
            'Transaction',
            [
                '$resource',
                function ($resource) {
                    var factory = {};
                    var methods = ['query', 'get', 'update', 'remove', 'save', 'update'];
                    var resource = $resource(
                        config.api + 'transactions/',
                        {},
                        {
                            query: {
                                method: 'GET',
                                url: config.api + 'transactions',
                                isArray: true,
                                transformResponse: function (data, headersGetter) {
                                    var headers = headersGetter();
                                    var transactions = angular.fromJson(data);

                                    transactions.push({total: parseInt(headers['x-total-count'], 10) || transactions.length});

                                    return transactions;
                                }
                            },
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
                        }
                    );

                    for (var i = 0; i < methods.length; i++) {
                        (function (method) {
                            factory[method] = function () {
                                return resource[method].apply(this, arguments);
                            }
                        })(methods[i]);
                    }

                    factory.query = function (params, success, error) {
                        resource.query(
                            params,
                            function (transactions) {
                                var lastEl = transactions.pop();

                                transactions.total = lastEl.total;

                                if (typeof success === 'function') {
                                    success(transactions);
                                }
                            },
                            error
                        );
                    };


                    return factory;
                }
            ]
        );

        return;
    }
);

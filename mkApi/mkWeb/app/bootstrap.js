require(
    [
        'require',
        'angular',
        'app',
        'components/dashboard/dashboard',
        'components/settings/settings',
        'components/categories/categories',
        'components/currencies/currencies',
        'components/accounts/accounts',
        'components/transactions/transactions',
        'components/navigation-menu/navigation-menu',
        'components/accounts/accounts',
        'components/credit-calculator/credit-calculator',

        'mkDirectives'
    ],
    function (require, ng) {
        'use strict';

        require(
            [
                'domReady!'
            ],
            function (document) {
                ng.bootstrap(
                    document,
                    [
                        'app'
                    ]
                );
            }
        );
    }
);

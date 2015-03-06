/**
 * bootstraps angular onto the window.document node
 */

define(
    [
        'require',
        'angular',
        'app',
        'components/categories/categories',
        'components/currencies/currencies',
        'components/accounts/accounts',
        'components/navigation-menu/navigation-menu'
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

define(
    [
        'app',
        'text!./menu.html',
        'text!./listItemCommon.html',
        'text!./listItemOpenable.html'
    ],
    function (app, menuTemplate, itemCommonTemplate, itemOpenableTemplate) {
        'use strict';

        console.info('menu directive load');

        app.directive('navigation-menu', function() {
            return {
                restrict: 'A',
                scope: {
                    menu: '=menu'/*,
                    cls: '=ngClass'*/
                },
                replace: true,
                template: 'menuTemplate',
                link: function($scope, $element, attrs) {
                    console.info('Menu directive linking', $scope, $element, attrs);

                    /*
                    element.addClass(attrs.class);
                    element.addClass(scope.cls);
                    */
                }
            };
        });

        return;
    }
);
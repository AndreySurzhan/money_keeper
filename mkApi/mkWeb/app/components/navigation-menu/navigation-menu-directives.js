define(
    [
        'app',
        'text!./menu.html',
        'text!./listItemCommon.html',
        'text!./listItemOpenable.html'
    ],
    function (app, menuTemplate, itemCommonTemplate, itemOpenableTemplate) {
        'use strict';

        app.directive('navigationMenu', function() {
            return {
                restrict: 'A',
                scope: {
                    navMenu: '=navigationMenu',
                    cls: '=ngClass'
                },
                replace: true,
                template: menuTemplate,
                link: function($scope, $element, attrs) {
                    $element.addClass(attrs.class);
                    $element.addClass($scope.cls);
                }
            };
        });

        app.directive(
            'menuItem',
            [
                '$compile',
                function ($compile) {
                    return {
                        restrict: 'A',
                        scope: {
                            menuItem: '=menuItem',
                            cls: '=ngClass'
                        },
                        replace: true,
                        link: function ($scope, $element, attrs) {
                            var menuItem = $scope.menuItem,
                                hasChildren = !!(menuItem.children && menuItem.children.length);

                            $element.html(
                                hasChildren
                                    ? itemOpenableTemplate
                                    : itemCommonTemplate
                            );
                            $element.addClass(attrs.class);
                            $element.addClass($scope.cls);

                            if (hasChildren) {
                                $element.addClass('xn-openable');
                            }

                            if (menuItem.active) {
                                $element.addClass('active');
                            }

                            $scope.menuItem.onClick = function () {
                                if (hasChildren) {
                                    $element.toggleClass('active');
                                }
                            };


                            $compile($element.contents())($scope);
                        }
                    };
                }
            ]
        );

        return;
    }
);
define(
    [
        'app',
        'text!./category-tree.html',
        'text!./category-tree-item.html'
    ],
    function (app, categoryTreeTemplate, categoryTreeItemTemplate) {
        'use strict';

        app.directive('categoriesTree', function() {
            return {
                restrict: 'A',
                scope: {
                    categoryTreeItem: '=categoriesTree',
                    cls: '=ngClass'
                },
                replace: true,
                template: categoryTreeTemplate,
                link: function($scope, $element, attrs) {
                    $element.addClass(attrs.class);
                    $element.addClass($scope.cls);
                }
            };
        });

        app.directive(
            'categoryTreeItem',
            [
                '$compile',
                function ($compile) {
                    return {
                        restrict: 'A',
                        scope: {
                            categoryTreeItem: '=categoryTreeItem',
                            cls: '=ngClass'
                        },
                        replace: true,
                        link: function ($scope, $element, attrs) {
                            var categoryTreeItem = $scope.categoryTreeItem,
                                hasChildren = !!(categoryTreeItem.children && categoryTreeItem.children.length);

                            $element.html(categoryTreeItemTemplate);

                            if (hasChildren) {
                                $element.append(categoryTreeTemplate);
                            }

                            $element.addClass(attrs.class);
                            $element.addClass($scope.cls);

                            $compile($element.contents())($scope);
                        }
                    };
                }
            ]
        );

        return;
    }
);

define(
    [
        'text!./panelRefreshingLayout.html'
    ],
    function (panelRefreshingLayout) {
        'use strict';

        return [
            {
                name: 'panelDisabled',
                func: function() {
                    return {
                        restrict: 'A',
                        link: function(scope, element, attrs) {
                            var layoutSelector = '.panel-refresh-layer';

                            scope.$watch(attrs.panelDisabled, function (newValue, oldValue) {
                                element.find(layoutSelector).remove();

                                if (newValue) {
                                    element.append(panelRefreshingLayout);
                                }
                            });
                        }
                    };
                }
            }
        ];
    }
);

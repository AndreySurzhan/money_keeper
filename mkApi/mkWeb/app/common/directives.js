define(
    [
        'angular',
        'text!./common/panelRefreshingLayout.html'
    ],
    function (ng,panelRefreshingLayout) {
        'use strict';

        var moneyKeeperDirectives = ng.module(
            'moneyKeeperDirectives',
            []
        );

        moneyKeeperDirectives.directive('panelDisabled', function() {
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
        });

        return moneyKeeperDirectives;
    }
);

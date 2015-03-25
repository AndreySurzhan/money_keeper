define(
    [
        'app',
        'json!config',
        'datedropper'
    ],
    function (app, config, $) {
        'use strict';

        app.directive('datedropper', function() {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    var params = config.plugins.datedropper;

                    params.format = attrs.datedropper || params.format;

                    $(element).dateDropper(params);

                    $(element).on('change', function () {
                        var chains = attrs.ngModel.split('.');
                        var scopeField = scope;

                        for (var i = 0; i < chains.length -1; i++) {
                            scopeField = scopeField[chains[i]];
                        }

                        scopeField[chains[chains.length -1]] = $(this).val();

                    });
                }
            };
        });

        return;
    }
);

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
                        scope[attrs.ngModel] = $(this).val();
                    });
                }
            };
        });

        return;
    }
);

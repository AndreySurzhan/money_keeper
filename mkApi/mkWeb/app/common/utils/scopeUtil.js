
define(
    [],
    function () {
        var options = {
            scopeApplyInterval: 10
        };

        return {
            /**
             * Apply scope despite the status
             *
             * @param {angular.$scope} $scope
             * @param {function} [callback]
             *
             * @returns void
             */
            applySafely: function ($scope, callback) {
                var interval = options.scopeApplyInterval,
                    phase = $scope.$$phase,
                    that = this;

                if (phase !== '$apply' &&
                    phase !== '$digest') {
                    $scope.$apply(callback);
                } else {
                    setTimeout(function () {
                        that.applySafely($scope, callback);
                    }, interval);
                }
            },

            /**
             * Return scope value
             * @param {angular.$scope} $scope
             * @param {string} fieldName - model.smth1.smth2
             *
             * @returns {*}
             */
            getScopeValueByString: function ($scope, fieldName) {
                var i;
                var result = $scope;
                var steps = fieldName.split('.');

                for (i = 0; i < steps.length; i++) {
                    result = result[steps[i]];
                }

                return result;
            }
        }
    }
);

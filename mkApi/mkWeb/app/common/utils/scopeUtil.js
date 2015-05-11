
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
             * returns void
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
            }
        }
    }
);

define(
    [
        'logger',
        'scopeUtil'
    ],
    function (logger, scopeUtil) {
        return {
            /**
             * Initialize control state
             *
             * @param {angular.$scope} $scope
             * @param {string} controlName
             * @param {Object} [params]
             * @param {Object[]} [params.data]
             * @param {boolean} [params.forceUpdating]
             * @param {function} [params.callback]
             *
             * @returns void
             */
            initControl: function ($scope, controlName, params) {
                var controlState;

                $scope = $scope || {};
                $scope.formState = $scope.formState || {};
                controlState = $scope.formState[controlName];

                if (!controlState) {
                    logger.error('Control "' + controlName + '" does not exist.');
                    return;
                }

                params = params || {};
                params.data = params.data || null;
                params.forceUpdating = params.forceUpdating || false;
                params.callback = (typeof params.callback === 'function') ?
                    params.callback :
                    function () {};

                controlState.enable = true;
                controlState.visible = true;

                if (params.data) {
                    controlState.data = params.data;
                }

                if (params.forceUpdating) {
                    scopeUtil.applySafely($scope, params.callback);
                } else {
                    params.callback();
                }
            },

            /**
             * Initialize control state
             *
             * @param {angular.$scope} $scope
             * @param {string} controlName
             * @param {Object} [params]
             * @param {boolean} [params.forceUpdating]
             * @param {function} [params.callback]
             *
             * @returns void
             */
            hideAndDisableControl: function ($scope, controlName, params) {
                var controlState;

                $scope = $scope || {};
                $scope.formState = $scope.formState || {};
                controlState = $scope.formState[controlName];

                if (!controlState) {
                    logger.error('Control "' + controlName + '" does not exist.');
                    return;
                }

                params = params || {};
                params.forceUpdating = params.forceUpdating || false;
                params.callback = (typeof params.callback === 'function') ?
                    params.callback :
                    function () {};

                controlState.enable = false;
                controlState.visible = false;
                controlState.data = [];

                if (params.forceUpdating) {
                    scopeUtil.applySafely($scope, params.callback);
                } else {
                    params.callback();
                }
            },

            validateForm: function (form) {
                form.$setDirty();

                for (var field in form) {
                    if (form.hasOwnProperty(field) &&
                        typeof form[field] === 'object' &&
                        typeof form[field].$validate === 'function') {

                        form[field].$validate();
                        form[field].$setDirty();
                    }
                }
            }
        }
    }
);

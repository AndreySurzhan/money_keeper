define(
    [
        'scopeUtil'
    ],
    function (scopeUtil) {
        'use strict';

        var regExps = {
            integer: /^\-?\d+$/,
            number: /^[0-9]*(\.)?[0-9]+$/
        };

        return [
            {
                name: 'mkRequired',
                func: function () {
                    return {
                        require: 'ngModel',
                        link: function (scope, elm, attrs, ctrl) {
                            ctrl.$validators.mkRequired = function (modelValue, viewValue) {
                                return attrs.disabled || !!viewValue;
                            };
                        }
                    };
                }
            },
            {
                name: 'mkEntitiesNotEqual',
                func: function () {
                    return {
                        require: 'ngModel',
                        link: function ($scope, elm, attrs, ctrl) {
                            ctrl.$validators.mkEntitiesNotEqual = function (currentValue) {
                                var valueForComparing = scopeUtil.getScopeValueByString($scope, attrs.mkEntitiesNotEqual);

                                if (!currentValue || !valueForComparing) {
                                    return true;
                                }

                                return currentValue._id !== valueForComparing._id ;
                            };
                        }
                    };
                }
            },
            {
                name: 'mkInteger',
                func: function () {
                    return {
                        require: 'ngModel',
                        link: function (scope, elm, attrs, ctrl) {
                            ctrl.$validators.mkInteger = function (modelValue, viewValue) {
                                if (ctrl.$isEmpty(modelValue)) {
                                    return true;
                                }

                                if (regExps.integer.test(viewValue)) {
                                    return true;
                                }

                                return false;
                            };
                        }
                    };
                }
            },
            {
                name: 'mkNumber',
                func: function () {
                    return {
                        require: 'ngModel',
                        link: function (scope, elm, attrs, ctrl) {
                            ctrl.$validators.mkNumber = function (modelValue, viewValue) {
                                if (ctrl.$isEmpty(modelValue)) {
                                    return true;
                                }

                                modelValue = viewValue = viewValue.replace(',', '.');

                                if (regExps.number.test(viewValue)) {
                                    return true;
                                }

                                return false;
                            };
                        }
                    };
                }
            }
        ];
    }
);

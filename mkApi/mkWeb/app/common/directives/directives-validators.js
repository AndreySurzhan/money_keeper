define(
    [],
    function () {
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
                                return !!viewValue;
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

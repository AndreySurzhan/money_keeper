define(
    [
        'mkControllers',
        'formUtil',
        'json!enums',
        'json!config',
        'underscore',
        'jquery',
        'logger'
    ],
    function (mkControllers, formUtil, enums, config, _, $, logger) {
        var controllerName = 'TransactionEditCtrl';
        var uploadFileUrl = '/api/transactions/import/upload-file';

        var getUploadFileSettings = function (source) {
            var fileUploadPresets = {
                easyfinance: {
                    acceptedTypes: 'text/csv',
                    allowDirectory: false,
                    allowMultipleFiles: false
                }
            };

            if (!source) {
                logger.error('Illegal upload source "' + source + '"');
                return false;
            }

            if (!_.has(fileUploadPresets, source)) {
                logger.error('Does not have upload file settings for "' + source + '"');
                return false;
            }

            return {
                acceptedTypes: fileUploadPresets[source].acceptedTypes,
                allowDirectory: fileUploadPresets[source].allowDirectory,
                allowMultipleFiles: fileUploadPresets[source].allowMultipleFiles
            };
        };

        var uploadFile = function (file, source, onProgressCallback, Upload) {
            var result = new $.Deferred();

            if (typeof onProgressCallback !== 'function') {
                onProgressCallback = function () {};
            }

            Upload.upload({
                url: uploadFileUrl,
                fields: {
                    'source': source
                },
                file: file
            })
                .progress(function (evt) {
                    onProgressCallback(parseInt(100 * evt.loaded / evt.total));
                })
                .success(function (data, status, headers, config) {
                    result.resolve(data);
                })
                .error(function (data, status, headers, config) {
                    result.reject(status);
                });

            return result.promise();
        };

        var getAccounts = function (accountsFactory) {
            var result = new $.Deferred();

            logger.groupCollapsed('Getting accounts');
            logger.time('Getting accounts');
            accountsFactory.query(
                function (accounts) {
                    logger.timeEnd('Getting accounts');
                    logger.logAccounts(accounts);
                    logger.groupEnd('Getting accounts');

                    result.resolve(accounts)
                },
                function (error) {
                    logger.timeEnd('Getting accounts');
                    logger.groupEnd('Getting accounts');
                    logger.error(error);

                    result.reject(error);
                }
            );

            return result.promise();
        };

        var getIncomeCategories = function (categoriesFactory) {
            var result = $.Deferred();

            logger.groupCollapsed('Getting income categories');
            logger.time('Getting income categories');
            categoriesFactory.getIncome(
                function (categories) {
                    logger.timeEnd('Getting income categories');
                    logger.logCategories(categories);
                    logger.groupEnd('Getting income categories');

                    result.resolve(categories)
                },
                function (error) {
                    logger.timeEnd('Getting income categories');
                    logger.groupEnd('Getting income categories');
                    logger.error(error);

                    result.reject(error);
                }
            );

            return result.promise();
        };

        var getOutcomeCategories = function (Category) {
            var result = new $.Deferred();

            logger.groupCollapsed('Getting outcome categories');
            logger.time('Getting outcome categories');
            Category.getOutcome(
                function (categories) {
                    logger.timeEnd('Getting outcome categories');
                    logger.logCategories(categories);
                    logger.groupEnd('Getting outcome categories');

                    result.resolve(categories);
                },
                function (error) {
                    logger.timeEnd('Getting outcome categories');
                    logger.groupEnd('Getting outcome categories');
                    logger.error(error);

                    result.reject(error);
                }
            );

            return result.promise();
        };

        // Form state

        var initFormState = function ($scope, source) {
            $scope.formState = {};

            // Upload file box
            $scope.formState.uploadFile = {
                visible: true,
                acceptedTypes: null,
                allowDirectory: null,
                allowMultipleFiles: null
            };
            _.extend($scope.formState.uploadFile, getUploadFileSettings(source));

            // Uploading file progress box
            $scope.formState.uploadingProgress = {
                visible: false
            };

            // Categories matching box
            $scope.formState.categoriesMatching = {
                visible: false,
                currentTab: 'accounts',
                nextButtonVisible: false,
                importButtonVisible: false
            };

            // Error message box
            $scope.formState.errorMessage = {
                visible: false,
                message: ''
            };
        };

        var showUploadingWindow = function ($scope) {
            $scope.formState.uploadFile.visible = false;
            $scope.formState.categoriesMatching.visible = false;
            $scope.formState.errorMessage.visible = false;

            $scope.formState.categoriesMatching.nextButtonVisible = false;
            $scope.formState.categoriesMatching.importButtonVisible = false;

            $scope.formState.uploadingProgress.visible = true;
        };

        var showMatchingWindow = function ($scope, data, accountsFactory, categoriesFactory) {
            var i;

            $scope.formState.uploadFile.visible = false;
            $scope.formState.uploadingProgress.visible = false;
            $scope.formState.errorMessage.visible = false;

            $scope.formState.categoriesMatching.visible = true;
            $scope.formState.categoriesMatching.nextButtonVisible = true;
            $scope.formState.categoriesMatching.importButtonVisible = false;

            $scope.accounts = [];
            for (i = 0; i < data.accounts.length; i++) {
                $scope.accounts.push({
                    name: data.accounts[i],
                    matchedAccount: null
                });
            }

            $scope.incomeCategories = [];
            for (i = 0; i < data.incomeCategories.length; i++) {
                $scope.incomeCategories.push({
                    name: data.incomeCategories[i],
                    matchedCategory: null
                });
            }

            $scope.outcomeCategories = [];
            for (i = 0; i < data.outcomeCategories.length; i++) {
                $scope.outcomeCategories.push({
                    name: data.outcomeCategories[i],
                    matchedCategory: null
                });
            }

            getAccounts(accountsFactory)
                .done(function (accounts) {
                    $scope.myAccounts = accounts;
                });

            getIncomeCategories(categoriesFactory)
                .done(function (categories) {
                    $scope.myIncomeCategories = categories;
                });

            getOutcomeCategories(categoriesFactory)
                .done(function (categories) {
                    $scope.myOutcomeCategories = categories;
                });
        };

        var showErrorWindow = function ($scope, message) {
            $scope.formState.uploadFile.visible = false;
            $scope.formState.uploadingProgress.visible = false;
            $scope.formState.categoriesMatching.visible = false;

            $scope.formState.categoriesMatching.nextButtonVisible = false;
            $scope.formState.categoriesMatching.importButtonVisible = false;

            $scope.formState.errorMessage.visible = true;
            $scope.formState.errorMessage.message = message;
        };

        mkControllers.controller(
            controllerName,
            [
                '$scope',
                '$modalInstance',
                'Upload',
                'Account',
                'Category',
                'importSource',
                function ($scope, $modalInstance, Upload, accountsFactory, categoriesFactory, importSource) {
                    logger.info('--- Import Transaction controller initialize ---');

                    initFormState($scope, importSource);

                    $scope.$watch('files', function () {
                        if (!$scope.files || !$scope.files.length) {
                            return;
                        }

                        showUploadingWindow($scope);

                        uploadFile($scope.files[0], importSource, function (progress) {
                            $scope.uploadingProgress = progress;
                        }, Upload)
                            .done(function (data) {
                                showMatchingWindow($scope, data, accountsFactory, categoriesFactory);
                            })
                            .fail(function (message) {
                                showErrorWindow($scope, message);
                            });
                    });

                    $scope.goNextTab = function () {
                        var currentTab = $scope.formState.categoriesMatching.currentTab;

                        switch (currentTab) {
                            case 'accounts':
                                currentTab = 'incomeCategories';
                                break;
                            case 'incomeCategories':
                                currentTab = 'outcomeCategories';
                                break;
                        }

                        $scope.formState.categoriesMatching.currentTab = currentTab
                    };

                    $scope.import = function () {
                        var formNames = {
                            accounts: 'accountsMatchingForm',
                            incomeCategories: 'incomeCategoriesMatchingForm',
                            outcomeCategories: 'outcomeCategoriesMatchingForm'
                        };

                        console.info('import');
                        console.log('accounts', $scope.accounts);
                        console.log('income categories', $scope.incomeCategories);
                        console.log('outcome categories', $scope.outcomeCategories);

                        formUtil.validateForm($scope.importForm);
                        if (!$scope.importForm.$valid) {
                            console.error('form is not valid');
                            return;
                        }
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                }
            ]
        );

        return controllerName;
    }
);

define(
    [
        'mkControllers',
        'json!enums',
        'json!config',
        'underscore',
        'jquery',
        'logger'
    ],
    function (mkControllers, enums, config, _, $, logger) {
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
                visible: false
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

            $scope.formState.uploadingProgress.visible = true;
        };

        var showMatchingWindow = function ($scope) {
            $scope.formState.uploadFile.visible = false;
            $scope.formState.uploadingProgress.visible = false;
            $scope.formState.errorMessage.visible = false;

            $scope.formState.categoriesMatching.visible = true;
        };

        var showErrorWindow = function ($scope, message) {
            $scope.formState.uploadFile.visible = false;
            $scope.formState.uploadingProgress.visible = false;
            $scope.formState.categoriesMatching.visible = false;

            $scope.formState.errorMessage.visible = true;
            $scope.formState.errorMessage.message = message;
        };

        mkControllers.controller(
            controllerName,
            [
                '$scope',
                '$modalInstance',
                'Upload',
                'importSource',
                function ($scope, $modalInstance, Upload, importSource) {
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
                            .done(function () {
                                showMatchingWindow($scope);
                            })
                            .fail(function (message) {
                                showErrorWindow($scope, message);
                            });
                    });

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    }
                }
            ]
        );

        return controllerName;
    }
);

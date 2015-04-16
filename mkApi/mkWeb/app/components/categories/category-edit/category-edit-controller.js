define(
    [
        'mkControllers',
        'logger',
        'scopeUtil',
        'entityUtil',
        '../categories-services'
    ],
    function (mkControllers, logger, scopeUtil, entityUtil) {

        // Categories
        var storedIncomeCategories;
        var getIncomeCategories = function (Category) {
            var result = $.Deferred();

            if (storedIncomeCategories) {
                logger.log('Return stored income categories');
                result.resolve(storedIncomeCategories);
                return result.promise();
            }

            logger.groupCollapsed('Getting income categories');
            logger.time('Getting income categories');
            Category.getIncome(
                function (categories) {
                    logger.timeEnd('Getting income categories');
                    logger.logCategories(categories);
                    logger.groupEnd('Getting income categories');

                    storedIncomeCategories = categories;
                    result.resolve(storedIncomeCategories)
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
        var storedOutcomeCategories;
        var getOutcomeCategories = function (Category) {
            var result = new $.Deferred();

            if (storedOutcomeCategories) {
                logger.log('Return stored outcome categories');
                result.resolve(storedOutcomeCategories);
                return result.promise();
            }

            logger.groupCollapsed('Getting outcome categories');
            logger.time('Getting outcome categories');
            Category.getOutcome(
                function (categories) {
                    logger.timeEnd('Getting outcome categories');
                    logger.logCategories(categories);
                    logger.groupEnd('Getting outcome categories');

                    storedOutcomeCategories = categories;
                    result.resolve(storedOutcomeCategories);
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
        var getEmptyCategoryData = function () {
            var result = new $.Deferred();

            logger.log('Creating empty category');

            result.resolve({
                name: '',
                income: false,
                parent: 0
            });

            return result.promise();
        };
        var getCategoryDataById = function (id, categoriesFactory) {
            var result = new $.Deferred();

            logger.groupCollapsed('Getting category  #' + id);
            logger.time('Getting category #' + id);
            categoriesFactory.get(
                {
                    id: id
                },
                function (category) {
                    logger.timeEnd('Getting category #' + id);
                    logger.logCategories(category);
                    logger.groupEnd('Getting category  #' + id);

                    result.resolve(category);
                },
                function (error) {
                    logger.timeEnd('Getting category #' + id);
                    logger.groupEnd('Getting category  #' + id);

                    result.reject(error);
                }
            );

            return result.promise();
        };
        var initCategoryForm = function (category, categoriesFactory, $scope, operationType) {
            var result = new $.Deferred();
            var categories;

            if (category.income) {
                categories = getIncomeCategories(categoriesFactory);
            } else {
                categories = getOutcomeCategories(categoriesFactory);
            }

            $.when(categories)
                .done(function (categoriesList) {
                    entityUtil.normalizeEntityField(category, 'parent', '_id', categoriesList);

                    formControlInit($scope, 'name');
                    if (operationType === 'create') {
                        formControlInit($scope, 'income');
                    } else {
                        formControlDisable($scope, 'income');
                    }
                    formControlInit($scope, 'parent', categoriesList);

                    formControlInit($scope, 'submit');

                    result.resolve(category);
                })
                .fail(function (error) {
                    result.reject(error);
                });

            return result.promise();
        };
        var getPreparedData = function (data) {
            var attributesMap = {
                name: function (name) {
                    return name;
                },
                income: function (income) {
                    return income;
                },
                parent: function (parentCategory) {
                    var parentCategoryId;

                    if (_.isObject(parentCategory)) {
                        parentCategoryId = parentCategory._id;
                    } else {
                        parentCategoryId = parentCategory;
                    }

                    parentCategoryId = parentCategoryId === 0 ? null : parentCategoryId;

                    return parentCategoryId;
                }
            };
            var preparedData = {};

            for (var attribute in attributesMap) {
                if (!attributesMap.hasOwnProperty(attribute)) {
                    return;
                }

                preparedData[attribute] = attributesMap[attribute](data[attribute]);
            }

            return preparedData;
        };
        var createCategory = function (id, model, categoriesFactory) {
            var preparedData;
            var result = new $.Deferred();

            preparedData = getPreparedData(model);

            categoriesFactory.save(
                preparedData,
                function (category) {
                    result.resolve(category);
                },
                function (error) {
                    result.reject(error);
                }
            );

            return result.promise();
        };
        var saveCategory = function (id, model, categoriesFactory) {
            var preparedData;
            var result = new $.Deferred();

            preparedData = getPreparedData(model);
            delete preparedData.income;

            categoriesFactory.update(
                {
                    id: id
                },
                preparedData,
                function (category) {
                    result.resolve(category);
                },
                function (error) {
                    result.reject(error);
                }
            );

            return result.promise();
        };

        // Form state
        var formControlInit = function ($scope, controlName, controlData) {
            if (!$scope.formState[controlName]) {
                logger.error('Control "' + controlName + '" does not exist.');

                return;
            }

            $scope.formState[controlName].enable = true;
            $scope.formState[controlName].visible = true;

            if (controlData) {
                $scope.formState[controlName].data = controlData;
            }
        };
        var formControlDisable = function ($scope, controlName) {
            if (!$scope.formState[controlName]) {
                logger.error('Control "' + controlName + '" does not exist.');

                return;
            }

            $scope.formState[controlName].enable = false;
            $scope.formState[controlName].visible = false;
            $scope.formState[controlName].data = [];
        };
        var setInitialFormState = function ($scope) {
            $scope.formState = {
                name: {
                    enable: false
                },
                income: {
                    visible: false,
                    enable: false
                },
                parent: {
                    data: [],
                    enable: false
                },
                submit: {
                    enable: false
                },
                texts: {
                    header: 'header',
                    saveButton: 'save button'
                }
            };
        };
        var setCreateCategoryTexts = function ($scope, $filter) {
            $scope.formState.texts.header = $filter('translate')('components.categories.create.header');
            $scope.formState.texts.saveButton = $filter('translate')('common.buttons.create');

        };
        var setEditCategoryTexts = function ($scope, $filter) {
            $scope.formState.texts.header = $filter('translate')('components.categories.edit.header');
            $scope.formState.texts.saveButton = $filter('translate')('common.buttons.save');
        };

        mkControllers.controller(
            'CategoryEditCtrl',
            [
                '$scope',
                '$routeParams',
                '$filter',
                'Category',
                function ($scope, $routeParams, $filter, Category) {
                    logger.info('--- Edit Category controller initialize ---');
                    logger.time('Edit Category controller initialize');

                    var categoryOperationType;
                    var categoryPromise;

                    $scope.id = $routeParams.id;
                    setInitialFormState($scope);

                    if ($scope.id === 'add') {
                        categoryOperationType = 'create';
                        setCreateCategoryTexts($scope, $filter);
                        categoryPromise = getEmptyCategoryData();
                    } else {
                        categoryOperationType = 'edit';
                        setEditCategoryTexts($scope, $filter);
                        categoryPromise = getCategoryDataById($scope.id, Category);
                    }

                    categoryPromise.done(function (category) {
                        initCategoryForm(category, Category, $scope, categoryOperationType)
                            .done(function (category) {
                                $scope.model = category;
                                scopeUtil.applySafely($scope);
                                logger.timeEnd('Edit Category controller initialize');
                            })
                            .fail(function (error) {
                                logger.timeEnd('Edit Category controller initialize');
                                logger.error(error);
                            });
                    });

                    $scope.incomeChanged = function () {
                        initCategoryForm($scope.model, Category, $scope, categoryOperationType)
                            .done(function (category) {
                                $scope.model = category;
                            })
                            .fail(function (error) {
                                logger.error(error);
                            });
                    };

                    $scope.executeOperation = function () {
                        var operation;

                        switch (categoryOperationType) {
                            case 'create':
                                operation = createCategory($scope.id, $scope.model, Category);
                                break;
                            case 'edit':
                                operation = saveCategory($scope.id, $scope.model, Category);
                                break;
                            default:
                                logger.error('Unknown operation "' + categoryOperationType + '"');
                        }

                        operation
                            .done(function () {
                                logger.log('Category saved');
                                window.history.back();
                            })
                            .fail(function (error) {
                                logger.error(error);
                            });
                    };

                    $scope.cancel = function () {
                        window.history.back();
                    };
                }
            ]
        );

        return;
    }
);

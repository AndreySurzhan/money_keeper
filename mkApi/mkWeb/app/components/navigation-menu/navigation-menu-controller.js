define(
    [
        'mkControllers',
        'json!./menu.json'
    ],
    function (mkControllers, menu) {
        mkControllers.controller(
            'NavigationMenuCtrl',
            [
                '$scope',
                '$sce',
                function ($scope, $sce) {
                    $scope.menuHtml = $sce.trustAsHtml('<h3>Hi</h3>');

                    $scope.menuItemClickEvents = function (menuItem) {
                        menuItem.active = !menuItem.active;
                    }
                }
            ]
        );

        return;
    }
);

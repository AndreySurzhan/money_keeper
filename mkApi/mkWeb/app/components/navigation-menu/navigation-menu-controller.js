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
                function ($scope) {
                    $scope.menu = menu;

                    $scope.menuItemClickEvents = function (menuItem) {
                        menuItem.active = !menuItem.active;
                    }
                }
            ]
        );

        return;
    }
);

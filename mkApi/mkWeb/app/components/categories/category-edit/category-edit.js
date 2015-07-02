define(
    [
        './category-edit-controller',
        'text!./category-edit.html',
        './category-edit-translations',
        './category-edit-routes'
    ],
    function (editControllerName, template) {
        return {
            name: editControllerName,
            template: template
        };
    }
);
define(
    [
        './transaction-edit-controller',
        'text!./transaction-edit.html',
        './transaction-edit-directives',
        './transaction-edit-translations',
        './transaction-edit-routes'
    ],
    function (editControllerName, template) {
        return {
            name: editControllerName,
            template: template
        };
    }
);

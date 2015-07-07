define(
    [
        './transaction-import-controller',
        'text!./transaction-import.html',
        './transaction-import-translations'
    ],
    function (importControllerName, template) {
        return {
            name: importControllerName,
            template: template
        };
    }
);

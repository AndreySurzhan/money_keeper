define(
    [
        './credit-calculator-controller',
        'text!./credit-calculator.html',
        './credit-calculator-translations'
    ],
    function (creditCalculator, template) {
        return {
            controllerName: creditCalculator,
            template: template
        };
    }
);

define(
    [
        './credit-calculator-controller',
        'text!./credit-calculator.html'
    ],
    function (creditCalculator, template) {
        return {
            controllerName: creditCalculator,
            template: template
        };
    }
);

define(
    [
        'mkControllers'
    ],
    function (mkControllers) {
        mkControllers.controller(
            'creditCalculator',
            [
                '$scope',
                function ($scope) {
                    var vm = this;

                    //ToDo: add validation for coma in inputs and change it to dot
                    //Gain initial parameters from View
                    vm.calculateButtonEnabled  = false;
                    vm.credit = {
                        initialParameters: {
                            method: "Annuity", //method of credit calculation "Annuity" | "Differentiated"
                            amount: 300000, //total credit amount
                            interestRate: 20, //bank interest rate per year
                            numberOfMonth: 6, //credit duration (months)
                            startDate: null
                        }
                    };

                    var creditMethod = {
                        annuity: 'Annuity',
                        differentiated: 'Differentiated'
                    };

                    var params = vm.credit.initialParameters; //initialize new variable and assign new init params to it

                    //ToDo: provide correct validation for inputs
                    if (isNaN(params.amount) && isNaN(params.interestRate) && isNaN(params.numberOfMonth)) {
                        vm.calculateButtonEnabled  = true;
                    }

                    vm.calculate = function () {
                        vm.credit.calculation = creditCalculation(
                            params.amount,
                            params.interestRate,
                            params.numberOfMonth,
                            params.method,
                            params.startDate
                        );
                    };

                        console.log("VM after calculation");
                        console.log(vm);

                    function creditCalculation(amount, interestRate, numberOfMonth, method, startDate) {

                        switch (method) {
                            case creditMethod.annuity:
                                console.log("Calculate credit according to Annuity method");
                                return annuityCalculation(amount, interestRate, numberOfMonth, startDate);
                            case creditMethod.differentiated:
                                console.log("Calculate credit according to Differentiated method");
                                return diffCalculation(amount, interestRate, numberOfMonth, startDate);
                        }
                    }

                    function annuityCalculation(amount, interestRate, numberOfMonth, startDate) {
                        var calculation = {};
                        var j;
                        var monthlyAccruedInterest;
                        var monthlyClearPayment;
                        var monthlyPayment = annuityPayment(amount, interestRate, numberOfMonth);
                        var monthlyRemainder = amount; //initial remainder for the first month equals to amount

                        calculation.monthly = [];

                        //ToDo: Bind calculation to start date of credit
                        console.log("Start date of credit is " + startDate);


                        for (j = 0; j < numberOfMonth; j++) {
                            monthlyAccruedInterest = (monthlyRemainder * interestRate) / (12 * 100);
                            monthlyClearPayment =  monthlyPayment - monthlyAccruedInterest;
                            monthlyRemainder = monthlyRemainder - monthlyClearPayment;

                            //ToDo remove rounding and make round in the angular filter
                            calculation.monthly.push({
                                payment: parseFloat(monthlyPayment.toFixed(2)),
                                accruedInterest: parseFloat(monthlyAccruedInterest.toFixed(2)),
                                remainder: parseFloat(monthlyRemainder.toFixed(2)),
                                clearPayment: parseFloat(monthlyClearPayment.toFixed(2))
                            });
                        }

                        calculation.overPayment = parseFloat(((monthlyPayment * numberOfMonth) - amount).toFixed(2));

                        /**
                         * This function allows to calculate total monthly payment
                         * p = s * (i * (1 + i)^n) / (((1+i)^n) - 1)
                         *
                         * Where:
                         * p - monthly payment
                         * s - credit amount
                         * i - bank interest rate per month ((interestRate /100) / 12)
                         * n - credit duration (months)
                         */
                        function annuityPayment(s, i, n) {
                            var denominator;
                            var numerator;
                            var p;
                            var x;

                            i = (i / 100) / 12;
                            x = 1.0 + i;

                            numerator = s * i * Math.pow(x, n);
                            denominator = Math.pow(x, n) - 1;

                            p = numerator / denominator;

                            console.log("AnnuityMonthlyPaymentCalculation - " + p);
                            return p;
                        }

                        return calculation;
                    }

                    function diffCalculation(amount, interestRate, numberOfMonth, startDate) {
                        var calculation = {};
                        var monthlyAccruedInterest;
                        var monthlyClearPayment = amount / numberOfMonth;
                        var monthlyPayment;
                        var monthlyRemainder = amount; //initial remainder for the first month equals to amount
                        var j;
                        var totalPaymentSum = 0;

                        calculation.monthly = [];

                        //ToDo: Bind calculation to start date of credit
                        console.log("Start date of credit is " + startDate);

                        for (j = 0; j < numberOfMonth; j++) {
                            monthlyAccruedInterest = (monthlyRemainder * interestRate) / (100 * 12);
                            monthlyPayment = monthlyClearPayment + monthlyAccruedInterest;
                            monthlyRemainder = monthlyRemainder - monthlyClearPayment;
                            totalPaymentSum = totalPaymentSum + monthlyPayment;

                            //ToDo remove rounding and make round in the angular filter
                            calculation.monthly.push({
                                payment: parseFloat(monthlyPayment.toFixed(2)),
                                accruedInterest: parseFloat(monthlyAccruedInterest.toFixed(2)),
                                remainder: parseFloat(monthlyRemainder.toFixed(2)),
                                clearPayment: parseFloat(monthlyClearPayment.toFixed(2))
                            });
                        }

                        calculation.overPayment = parseFloat((totalPaymentSum - amount).toFixed(2));

                        return calculation;
                    }
                }
        ]);

        return 'creditCalculator';
    });

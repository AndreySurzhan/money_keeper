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
                    vm.calculateButtonState = false;
                    vm.credit = {
                        initialParameters: {
                            method: "Annuity", //method of credit calculation "Annuity" | "Differentiated"
                            amount: 10000, //total credit amount
                            interestRate: 12, //bank interest rate per year
                            numberOfMonth: 12, //credit duration (months)
                            startDate: null
                        }
                    };

                    var params = vm.credit.initialParameters; //initialize new variable and assign new init params to it

                    //ToDo: provide correct validation for inputs
                    if (isNaN(params.amount) && isNaN(params.interestRate) && isNaN(params.numberOfMonth)) {
                        vm.calculateButtonState = true;
                    }

                    vm.calculate = function () {
                        vm.credit.calculation = creditCalculation(params.amount, params.interestRate, params.numberOfMonth,
                            params.method, params.startDate);


                        console.log("VM after calculation");
                        console.log(vm);

                        function creditCalculation(amount, interestRate, numberOfMonth, creditMethod, startDate) {
                            var calculation = {};
                            var monthlyAccruedInterest;
                            var monthlyClearPayment;
                            var j;
                            var monthlyPayment = annuityPaymentCalculation(amount, interestRate, numberOfMonth);
                            var monthlyRemainder = amount; //initial monthly remainder for the first month equals to amount

                            calculation.overPayment = totalOverPayment(numberOfMonth, monthlyPayment, amount);
                            calculation.monthly = [];

                            //ToDo: add function for calculation of Differentiated credit
                            if (creditMethod === "Annuity") {
                                console.log("Calculate credit according to Annuity method")
                            }
                            if (creditMethod === "Differentiated") {
                                console.log("Calculate credit according to Annuity Differentiated")
                            }

                            //ToDo: Bind calculation to start date of credit
                            console.log("Start date of credit is " + startDate);

                            for (j = 0; j < numberOfMonth; j++) {
                                monthlyAccruedInterest = annuityAccruedInterest(interestRate, monthlyRemainder);
                                monthlyClearPayment = annuityClearPayment(monthlyAccruedInterest, monthlyPayment);
                                monthlyRemainder = annuityRemainder(monthlyClearPayment, monthlyRemainder);

                                calculation.monthly.push({
                                    payment: monthlyPayment,
                                    accruedInterest: monthlyAccruedInterest,
                                    remainder: monthlyRemainder,
                                    clearPayment: monthlyClearPayment
                                });
                            }

                            console.log("object Calculation\n");
                            console.log(calculation);

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
                            function annuityPaymentCalculation(s, i, n) {
                                var denominator;
                                var numerator;
                                var p;
                                var x;

                                i = parseFloat((i / 100) / 12);
                                x = 1.0 + i;

                                numerator = s * i * Math.pow(x, n);
                                denominator = Math.pow(x, n) - 1;

                                p = numerator / denominator;

                                console.log("AnnuityMonthlyPaymentCalculation - " + p);
                                return parseFloat(p.toFixed(2));
                            }

                            /**
                             * This function allows to calculate monthly accrued interest on the loan
                             * a = (r * i) / (100 * 12)
                             *
                             * Where:
                             * a - monthly accrued interest
                             * i - bank interest rate per year
                             * r - credit remainder regarding to current month
                             */
                            function annuityAccruedInterest(i, r) {
                                var a;

                                a = (r * i) / (100 * 12);

                                return parseFloat(a.toFixed(2));
                            }

                            /**
                             * This function allows to calculate clear payment of current month(without accrued
                             * interest on the loan)
                             * c = (p - a)
                             *
                             * Where:
                             * a - accrued interest regarding to current month
                             * c - clear monthly payment of current month
                             * p - monthly payment
                             */
                            function annuityClearPayment (a, p) {
                                var c;

                                c = p - a;

                                return parseFloat(c.toFixed(2));
                            }

                            /**
                             * This function allows to calculate credit remainder regarding to current month
                             * nr = (pr - c)
                             *
                             * Where:
                             * c - clear monthly payment of current month
                             * pr - remainder regarding to the previous month
                             * r - credit remainder regarding to current month
                             */
                            function annuityRemainder (c, pr) {
                                var r;

                                r = pr - c;

                                return parseFloat(r.toFixed(2));
                            }

                            /**
                             * This function allows to calculate credit overpayment
                             * o = (n * p - a)
                             *
                             * Where:
                             * 0 - total credit overpayment
                             * p - monthly payment
                             * s - initial credit amount
                             */
                            function totalOverPayment (n, p, s) {
                                var o;
                                
                                o = p * n - s;

                                return parseFloat(o.toFixed(2));
                            }

                            return calculation;
                        }
                    };

                    function deffMonthlyPaymentCalculation() {
                    }
                }
        ]);
        return 'creditCalculator';
    });

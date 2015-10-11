define(
    [
        'mkControllers',
        'moment',
        'json!config'
    ],
    function (mkControllers, moment, config) {
        mkControllers.controller(
            'creditCalculator',
            [
                '$scope',
                function ($scope) {
                    var vm = this;

                    moment.locale(config.lang);

                    //ToDo: add validation for coma in inputs and change it to dot
                    //Gain initial parameters from View
                    vm.calculateButtonEnabled  = false;
                    vm.credit = {
                        initialParameters: {
                            method: "Annuity", //method of credit calculation "Annuity" | "Differentiated"
                            amount: 300000, //total credit amount
                            interestRate: 20, //bank interest rate per year
                            numberOfMonth: 12, //credit duration (months)
                            startDate: "2015-10-16" //date when credit has been taken out
                        },
                        advRepayments: {
                            date: "2015-10-16",
                            type: "option-1",
                            amount: 15000
                        }
                    };
                    // initial form state
                    vm.formState = {
                        calculateButton: {
                            enable: false
                        },
                        sumTable: {
                            visible: false
                        }
                    };

                    var creditMethods = {
                        annuity: 'Annuity',
                        differentiated: 'Differentiated'
                    };

                    var creditParams = vm.credit.initialParameters; //initialize new variable and assign new init params to it
                    var advPayment = vm.credit.advRepayments;

                    //ToDo: provide correct validation for inputs
                    if (isNaN(creditParams.amount) && isNaN(creditParams.interestRate) && isNaN(creditParams.numberOfMonth)) {
                        vm.formState.calculateButton.enable = true;
                    }

                    vm.calculate = function () {
                        vm.credit.calculation = creditCalculation(
                            creditParams.amount,
                            creditParams.interestRate,
                            creditParams.numberOfMonth,
                            creditParams.method,
                            creditParams.startDate
                        );
                        vm.formState.sumTable.visible = true;
                    };

                    vm.addAdvRepayment = function () {
                        advPayment.list = addAdvRepayment(
                            advPayment.list,
                            advPayment.date,
                            advPayment.type,
                            advPayment.amount
                        );
                        console.log("\nAdvanced Payment after ADD \n");
                        console.log(advPayment);
                    };

                    vm.deleteAdvRepayment = function (id) {
                        advPayment.list = deleteAdvRepayment(id, advPayment.list);
                    };


                    //find our what calculation type was used
                    vm.isAnnuity =  function () {
                        if (!vm.credit.hasOwnProperty("calculation")) {
                            return false;
                        }

                        return vm.credit.calculation.method == creditMethods.annuity;
                    };

                    vm.isDifferentiated=  function () {
                        if (!vm.credit.hasOwnProperty("calculation")) {
                            return false;
                        }

                        return vm.credit.calculation.method == creditMethods.differentiated;
                    };

                    function addAdvRepayment (list, date, type, amount) {
                        list = Array.isArray(list) ? list : [];

                        list.push({
                            date: date,
                            type: type,
                            amount: amount,
                            id: guid()
                        });

                        return list
                    }

                    function deleteAdvRepayment (id, list) {
                        var i;

                        for (i = 0; i < list.length; i++) {
                            if (list[i].id === id) {
                                list.splice(list.indexOf(list[i]), 1)
                            }
                        }

                        return list;
                    }

                    function creditCalculation(amount, interestRate, numberOfMonth, method, startDate) {

                        switch (method) {
                            case creditMethods.annuity:
                                console.log("Calculate credit according to Annuity method");
                                return annuityCalculation(amount, interestRate, numberOfMonth, method, startDate);
                            case creditMethods.differentiated:
                                console.log("Calculate credit according to Differentiated method");
                                return diffCalculation(amount, interestRate, numberOfMonth, method, startDate);
                        }
                    }

                    function annuityCalculation(amount, interestRate, numberOfMonth, method, startDate) {
                        var calculation = {};
                        var currentPaymentDate;
                        var daysInMonth;
                        var endingPaymentDate = moment(startDate).add(numberOfMonth + 1, "months");
                        var firstPaymentDate = moment(startDate).add(1, "months");
                        var iRate = interestRate / 100;
                        var j;
                        var monthlyAccruedInterest;
                        var monthlyClearPayment;
                        var monthlyPayment = annuityPayment(amount, iRate, numberOfMonth);
                        var monthlyRemainder = amount; //initial remainder for the first month equals to amount
                        var totalPaymentSum = monthlyPayment * numberOfMonth;

                        calculation.monthly = [];

                        console.log("Start date of credit is " + firstPaymentDate);
                        console.log("End date of credit is " + endingPaymentDate);

                        for (j = 1; j <= numberOfMonth; j++) {
                            currentPaymentDate = moment(startDate).add((j), "months");
                            daysInMonth = currentPaymentDate.daysInMonth();
                            monthlyAccruedInterest = (monthlyRemainder * iRate * daysInMonth) / 365;
                            monthlyClearPayment =  monthlyPayment - monthlyAccruedInterest;
                            monthlyRemainder = monthlyRemainder - monthlyClearPayment;

                            calculation.monthly.push({
                                payment: monthlyPayment,
                                accruedInterest: monthlyAccruedInterest,
                                remainder: monthlyRemainder,
                                clearPayment: monthlyClearPayment,
                                dateOfPayment: currentPaymentDate
                            });
                        }

                        calculation.endingPaymentDate = endingPaymentDate;
                        calculation.firstPaymentDate = firstPaymentDate;
                        calculation.firstPayment = calculation.monthly[0].payment;
                        calculation.lastPayment = calculation.monthly[calculation.monthly.length - 1].payment;
                        calculation.method = method;
                        calculation.overPayment = (monthlyPayment * numberOfMonth) - amount;
                        calculation.totalPaymentSum = totalPaymentSum;

                        /**
                         * This function allows to calculate total monthly payment
                         * p = s * (i * (1 + i)^n) / (((1+i)^n) - 1)
                         *
                         * Where:
                         * p - monthly payment
                         * s - credit amount
                         * i - bank interest rate per month
                         * n - credit duration (months)
                         */
                        function annuityPayment(s, i, n) {
                            var denominator;
                            var numerator;
                            var p;
                            var x;

                            i = i / 12;
                            x = 1.0 + i;

                            numerator = s * i * Math.pow(x, n);
                            denominator = Math.pow(x, n) - 1;

                            p = numerator / denominator;

                            return p;
                        }

                        return calculation;
                    }

                    function diffCalculation(amount, interestRate, numberOfMonth, method, startDate) {
                        var calculation = {};
                        var currentPaymentDate;
                        var daysInMonth;
                        var endingPaymentDate = moment(startDate).add(numberOfMonth + 1, "months");
                        var firstPaymentDate = moment(startDate).add(1, "months");
                        var interestRate = interestRate / 100;
                        var j;
                        var monthlyAccruedInterest;
                        var monthlyClearPayment = amount / numberOfMonth;
                        var monthlyPayment;
                        var monthlyRemainder = amount; //initial remainder for the first month equals to amount
                        var totalPaymentSum = 0;

                        calculation.monthly = [];

                        console.log("Start date of credit is " + firstPaymentDate);
                        console.log("End date of credit is " + endingPaymentDate);

                        for (j = 1; j <= numberOfMonth; j++) {
                            currentPaymentDate = moment(startDate).add((j), "months");
                            daysInMonth = currentPaymentDate.daysInMonth();
                            monthlyAccruedInterest = (monthlyRemainder * interestRate * daysInMonth) / 365;
                            monthlyPayment = monthlyClearPayment + monthlyAccruedInterest;
                            monthlyRemainder = monthlyRemainder - monthlyClearPayment;
                            totalPaymentSum = totalPaymentSum + monthlyPayment;

                            calculation.monthly.push({
                                payment: monthlyPayment,
                                accruedInterest: monthlyAccruedInterest,
                                remainder: monthlyRemainder,
                                clearPayment: monthlyClearPayment,
                                dateOfPayment: currentPaymentDate
                            });
                        }

                        calculation.endingPaymentDate = endingPaymentDate;
                        calculation.firstPaymentDate = firstPaymentDate;
                        calculation.firstPayment = calculation.monthly[0].payment;
                        calculation.lastPayment = calculation.monthly[calculation.monthly.length - 1].payment;
                        calculation.method = method;
                        calculation.overPayment = totalPaymentSum - amount;
                        calculation.totalPaymentSum = totalPaymentSum;

                        return calculation;
                    }

                    //Globally Unique Identifier Generator
                    function guid() {
                        function s4() {
                            return Math.floor((1 + Math.random()) * 0x10000)
                                .toString(16)
                                .substring(1);
                        }

                        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                            s4() + '-' + s4() + s4() + s4();
                    }
                }
        ]);

        return 'creditCalculator';
    });

define(
    [
        'mkControllers',
        'moment',
        'json!config',
        'underscore'
    ],
    function (mkControllers, moment, config, _) {
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
                            date: "2016-05-16",
                            type: "decreasePayment",
                            amount: 32000
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

                    var advPayment = vm.credit.advRepayments;
                    var creditMethods = {
                        annuity: 'Annuity',
                        differentiated: 'Differentiated'
                    };
                    var creditParams = vm.credit.initialParameters; //initialize new variable and assign new init params to it
                    var repaymentType = {
                        decreaseDuration: 'decreaseDuration',
                        decreasePayment: 'decreasePayment'
                    };

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
                            creditParams.startDate,
                            advPayment.list
                        );
                        vm.formState.sumTable.visible = true;
                    };

                    //TODO: validation: impossible to add repayment to the last date of credit
                    //TODO: validation: impossible to add repayment decreaseDuration to the date before last
                    //Add and delete repayment information to credit object
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

                    //find our what calculation type or advanced repayment was used
                    vm.isAnnuity =  function () {
                        if (!vm.credit.hasOwnProperty("calculation")) {
                            return false;
                        }

                        return vm.credit.calculation.method == creditMethods.annuity;
                    };

                    vm.isDifferentiated =  function () {
                        if (!vm.credit.hasOwnProperty("calculation")) {
                            return false;
                        }

                        return vm.credit.calculation.method == creditMethods.differentiated;
                    };

                    vm.isAdvRepayment =  function () {
                        if (!vm.credit.hasOwnProperty("calculation")) {
                            return false;
                        }

                        return advPayment.list.length !== 0;
                    };

                    //Credit calculation function
                    function creditCalculation (amount,
                                                interestRate,
                                                numberOfMonth,
                                                method,
                                                startDate,
                                                advPaymentList) {
                        switch (method) {
                            case creditMethods.annuity:
                                console.log("Calculate credit according to Annuity method");
                                return annuityCalculation(
                                    amount,
                                    interestRate,
                                    numberOfMonth,
                                    method,
                                    startDate,
                                    advPaymentList);
                            case creditMethods.differentiated:
                                console.log("Calculate credit according to Differentiated method");
                                return diffCalculation(
                                    amount,
                                    interestRate,
                                    numberOfMonth,
                                    method,
                                    startDate,
                                    advPaymentList);
                        }
                    }

                    //Functions for Adding and deleting repayment information
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

                    //Functions with calculation of different type of credits
                    function annuityCalculation(amount,
                                                interestRate,
                                                numberOfMonth,
                                                method,
                                                startDate,
                                                advRepaymentsList) {
                        var advRepaymentAmout; // will be added to credit object and used in credit calculation table
                        var advRepaymentCalc = {};
                        var calculation = {};
                        var currentPaymentDate;
                        var endingPaymentDate = moment(startDate).add(numberOfMonth + 1, "months");
                        var firstPaymentDate = moment(startDate).add(1, "months");
                        var iRate = (interestRate / 100) / 12; //monthly interest rate
                        var i;
                        var j;
                        var monthlyAccruedInterest;
                        var monthlyClearPayment;
                        var monthlyPayment = annuityPayment(amount, iRate, numberOfMonth);
                        var monthlyRemainder = amount; //initial remainder for the first month equals to amount
                        var newMonthlyPayment = monthlyPayment;
                        var previousPaymentDate;
                        var totalPaymentSum = 0;

                        calculation.monthly = [];

                        console.log("Start date of credit is " + firstPaymentDate);
                        console.log("End date of credit is " + endingPaymentDate);

                        for (j = 1; j <= numberOfMonth; j++) {
                            advRepaymentAmout = 0;
                            currentPaymentDate = moment(startDate).add((j), "months");
                            previousPaymentDate = moment(startDate).add((j - 1 ), "months");
                            monthlyAccruedInterest = (monthlyRemainder * iRate);
                            monthlyClearPayment =  monthlyPayment - monthlyAccruedInterest;
                            monthlyRemainder = monthlyRemainder - monthlyClearPayment;
                            if (advRepaymentsList){
                                for (i = 0; i < advRepaymentsList.length; i++) {
                                    if (moment(advRepaymentsList[i].date)
                                            .isBetween(previousPaymentDate, currentPaymentDate)
                                        || moment(advRepaymentsList[i].date)
                                            .isSame(currentPaymentDate)) {

                                        advRepaymentCalc = advPaymentCalc(
                                            monthlyRemainder,
                                            advRepaymentsList[i].amount,
                                            totalPaymentSum,
                                            numberOfMonth,
                                            advRepaymentsList[i].type,
                                            monthlyPayment,
                                            iRate,
                                            j);

                                        monthlyRemainder = advRepaymentCalc.remainder;
                                        totalPaymentSum = advRepaymentCalc.totalSum;
                                        numberOfMonth = advRepaymentCalc.numberOfMonth;
                                        newMonthlyPayment = advRepaymentCalc.payment;
                                        advRepaymentAmout = advRepaymentCalc.advAmount;
                                    }
                                }
                            }

                            totalPaymentSum = totalPaymentSum + monthlyPayment;

                            if (j == numberOfMonth && monthlyRemainder !== 0) {
                                monthlyClearPayment = monthlyClearPayment + monthlyRemainder;
                                monthlyRemainder = monthlyRemainder - monthlyRemainder;
                                monthlyPayment = monthlyClearPayment + monthlyAccruedInterest;
                            }

                            calculation.monthly.push({
                                payment: monthlyPayment,
                                accruedInterest: monthlyAccruedInterest,
                                remainder: monthlyRemainder,
                                clearPayment: monthlyClearPayment,
                                dateOfPayment: currentPaymentDate,
                                advRepayment: advRepaymentAmout
                            });

                            monthlyPayment = newMonthlyPayment;
                        }

                        calculation.endingPaymentDate = endingPaymentDate;
                        calculation.firstPaymentDate = firstPaymentDate;
                        calculation.firstPayment = calculation.monthly[0].payment;
                        calculation.lastPayment = calculation.monthly[calculation.monthly.length - 1].payment;
                        calculation.method = method;
                        calculation.overPayment = totalPaymentSum - amount;
                        calculation.totalPaymentSum = totalPaymentSum;

                        /**
                         * This function allows to calculate total monthly payment
                         */
                        function annuityPayment(amount, interestRate, numberOfMonth) {
                            var denominator;
                            var numerator;
                            var payment;

                            numerator = amount * interestRate * Math.pow((1 + interestRate), numberOfMonth);
                            denominator = Math.pow((1 + interestRate), numberOfMonth) - 1;

                            payment = numerator / denominator;

                            return payment;
                        }

                        /**
                         * This function recalculate clearPayment of numberOfMonth due to advType
                         */
                        function advPaymentCalc(remainder,
                                                advAmount,
                                                totalSum,
                                                numberOfMonth,
                                                advType,
                                                payment,
                                                interestRate,
                                                payedMonths) {

                            var advPaymentCalc = {};
                            var numberOfMonthRemained = numberOfMonth - payedMonths;
                            var arg;

                            advPaymentCalc.advAmount = advAmount;
                            advPaymentCalc.remainder = remainder - advAmount;
                            advPaymentCalc.totalSum = totalSum + advAmount;
                            advPaymentCalc.numberOfMonth = numberOfMonth;
                            advPaymentCalc.payment = payment;

                            if (advType == repaymentType.decreasePayment) {
                                advPaymentCalc.payment = annuityPayment(
                                    advPaymentCalc.remainder,
                                    interestRate,
                                    numberOfMonthRemained);
                            }

                            if (advType == repaymentType.decreaseDuration) {
                                //recalc number of month for payment
                                arg = payment / (payment - ((interestRate) * advPaymentCalc.remainder));

                                numberOfMonthRemained = getBaseLog((interestRate + 1), arg);

                                advPaymentCalc.numberOfMonth = Math.ceil(payedMonths + numberOfMonthRemained);
                            }

                            return advPaymentCalc;
                        }

                        return calculation;
                    }

                    function diffCalculation(amount,
                                             interestRate,
                                             numberOfMonth,
                                             method,
                                             startDate,
                                             advRepaymentsList) {
                        var advRepaymentAmout; // will be added to credit object and used in credit calculation table
                        var advRepaymentCalc = {};
                        var calculation = {}; // main object which is returned by this function
                        var currentPaymentDate;
                        var daysInMonth;
                        var endingPaymentDate = moment(startDate).add(numberOfMonth + 1, "months");
                        var firstPaymentDate = moment(startDate).add(1, "months");
                        var iRate = (interestRate / 100) / 12;
                        var i;
                        var j;
                        var monthlyAccruedInterest;
                        var monthlyClearPayment = amount / numberOfMonth;
                        var monthlyPayment;
                        var monthlyRemainder = amount; //initial remainder for the first month equals to amount
                        var newMonthlyClearPayment = monthlyClearPayment;
                        var previousPaymentDate;
                        var totalPaymentSum = 0;

                        calculation.monthly = [];

                        console.log("Start date of credit is " + firstPaymentDate);
                        console.log("End date of credit is " + endingPaymentDate);

                        for (j = 1; j <= numberOfMonth; j++) {
                            advRepaymentAmout = 0;
                            currentPaymentDate = moment(startDate).add((j), "months");
                            previousPaymentDate = moment(startDate).add((j - 1 ), "months");
                            daysInMonth = currentPaymentDate.daysInMonth();
                            monthlyAccruedInterest = monthlyRemainder * iRate;
                            monthlyPayment = monthlyClearPayment + monthlyAccruedInterest;
                            monthlyRemainder = monthlyRemainder - monthlyClearPayment;
                            if (advRepaymentsList){
                                for (i = 0; i < advRepaymentsList.length; i++) {
                                    if (moment(advRepaymentsList[i].date)
                                            .isBetween(previousPaymentDate, currentPaymentDate)
                                        || moment(advRepaymentsList[i].date)
                                            .isSame(currentPaymentDate)) {

                                        advRepaymentCalc = advPaymentCalc(
                                            monthlyRemainder,
                                            advRepaymentsList[i].amount,
                                            totalPaymentSum,
                                            numberOfMonth,
                                            advRepaymentsList[i].type,
                                            monthlyClearPayment,
                                            j);

                                        monthlyRemainder = advRepaymentCalc.remainder;
                                        totalPaymentSum = advRepaymentCalc.totalSum;
                                        numberOfMonth = advRepaymentCalc.numberOfMonth;
                                        newMonthlyClearPayment = advRepaymentCalc.clearPayment;
                                        advRepaymentAmout = advRepaymentCalc.advAmount;
                                    }
                                }
                            }

                            if (j == numberOfMonth && monthlyRemainder !== 0) {
                                monthlyClearPayment = monthlyClearPayment + monthlyRemainder;
                                monthlyRemainder = monthlyRemainder - monthlyRemainder;
                                monthlyPayment = monthlyClearPayment + monthlyAccruedInterest;
                            }

                            totalPaymentSum = totalPaymentSum + monthlyPayment;

                            calculation.monthly.push({
                                payment: monthlyPayment,
                                accruedInterest: monthlyAccruedInterest,
                                remainder: monthlyRemainder,
                                clearPayment: monthlyClearPayment,
                                dateOfPayment: currentPaymentDate,
                                advRepayment: advRepaymentAmout
                            });

                            monthlyClearPayment = newMonthlyClearPayment;
                        }

                        calculation.endingPaymentDate = endingPaymentDate;
                        calculation.firstPaymentDate = firstPaymentDate;
                        calculation.firstPayment = calculation.monthly[0].payment;
                        calculation.lastPayment = calculation.monthly[calculation.monthly.length - 1].payment;
                        calculation.method = method;
                        calculation.overPayment = totalPaymentSum - amount;
                        calculation.totalPaymentSum = totalPaymentSum;

                        /**
                         * This function recalculate clearPayment of numberOfMonth due to advType
                         */
                        function advPaymentCalc(remainder,
                                                advAmount,
                                                totalSum,
                                                numberOfMonth,
                                                advType,
                                                clearPayment,
                                                payedMonths) {

                            var advPaymentCalc = {};

                            advPaymentCalc.advAmount = advAmount;
                            advPaymentCalc.remainder = remainder - advAmount;
                            advPaymentCalc.totalSum = totalSum + advAmount;
                            advPaymentCalc.numberOfMonth = numberOfMonth;
                            advPaymentCalc.clearPayment = clearPayment;

                            if (advType == repaymentType.decreasePayment) {
                                advPaymentCalc.clearPayment = advPaymentCalc.remainder / ((numberOfMonth) - payedMonths);
                            }

                            if (advType == repaymentType.decreaseDuration) {
                                advPaymentCalc.numberOfMonth = Math.ceil(((payedMonths)
                                + (advPaymentCalc.remainder / clearPayment))); //recalc number of month for payment
                            }

                            return advPaymentCalc;
                        }

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

                    function getBaseLog(base, arg) {

                        return Math.log(arg) / Math.log(base);
                    }

                }
        ]);

        return 'creditCalculator';
    });

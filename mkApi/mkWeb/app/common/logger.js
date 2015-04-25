define(
    [
        'json!config'
    ],
    function (config) {
        var logger = {};
        var operations = {
            log: 100,
            info: 300,
            warn: 600,
            time: 500,
            timeEnd: 500,
            group: 700,
            groupCollapsed: 700,
            groupEnd: 700,
            assert: 800,
            error: 900,
            table: 900
        };

        logger.log = function () {
            if (typeof console === 'object' &&
                (typeof console.log === 'function' || typeof console.log === 'object') &&
                operations.log >= config.logLevel) {
                console.log.apply(console, arguments);
            }
        };

        logger.info = function () {
            if (typeof console === 'object' &&
                (typeof console.info === 'function' || typeof console.info === 'object') &&
                operations.info >= config.logLevel) {
                console.info.apply(console, arguments);
            }
        };

        logger.warn = function () {
            if (typeof console === 'object' &&
                (typeof console.warn === 'function' || typeof console.warn === 'object') &&
                operations.warn >= config.logLevel) {
                console.warn.apply(console, arguments);
            }
        };

        logger.time = function () {
            if (typeof console === 'object' &&
                (typeof console.time === 'function' || typeof console.time === 'object') &&
                operations.time >= config.logLevel) {
                console.time.apply(console, arguments);
            }
        };

        logger.timeEnd = function () {
            if (typeof console === 'object' &&
                (typeof console.timeEnd === 'function' || typeof console.timeEnd === 'object') &&
                operations.timeEnd >= config.logLevel) {
                console.timeEnd.apply(console, arguments);
            }
        };

        logger.group = function () {
            if (typeof console === 'object' &&
                (typeof console.group === 'function' || typeof console.group === 'object') &&
                operations.group >= config.logLevel) {
                console.group.apply(console, arguments);
            }
        };

        logger.groupCollapsed = function () {
            if (typeof console === 'object' &&
                (typeof console.groupCollapsed === 'function' || typeof console.groupCollapsed === 'object') &&
                operations.groupCollapsed >= config.logLevel) {
                console.groupCollapsed.apply(console, arguments);
            }
        };

        logger.groupEnd = function () {
            if (typeof console === 'object' &&
                (typeof console.groupEnd === 'function' || typeof console.groupEnd === 'object') &&
                operations.groupEnd >= config.logLevel) {
                console.groupEnd.apply(console, arguments);
            }
        };

        logger.error = function () {
            if (typeof console === 'object' &&
                (typeof console.error === 'function' || typeof console.error === 'object') &&
                operations.error >= config.logLevel) {
                console.error.apply(console, arguments);
            }
        };

        logger.assert = function () {
            if (typeof console === 'object' &&
                (typeof console.assert === 'function' || typeof console.assert === 'object') &&
                operations.assert >= config.logLevel) {
                console.assert.apply(console, arguments);
            }
        };

        logger.table = function () {
            if (typeof console === 'object' &&
                (typeof console.table === 'function' || typeof console.table === 'object') &&
                operations.table >= config.logLevel) {
                console.table.apply(console, arguments);
            }
        };

        // Transactions
        logger.logTransactions = function (transactions) {
            this.table(transactions, ['_id', 'note', 'accountDestination', 'accountSource', 'type', 'value', 'category', 'date', '_owner']);
        };

        // Accounts
        logger.logAccounts = function (accounts) {
            this.table(accounts, ['_id', 'currency', 'initValue', 'value', 'name', '_owner']);
        };

        // Categories
        logger.logCategories = function (categories) {
            this.table(categories, ['_id', 'income', 'name', '_owner']);
        };

        // Currencies
        logger.logCurrencies = function (currencies) {
            this.table(currencies, ['_id', 'name', '_owner']);
        };

        return logger;
    }
);

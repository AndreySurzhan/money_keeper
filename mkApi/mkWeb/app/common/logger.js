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
            error: 900,
            assert: 800
        };

        for (var key in operations) {
            if (operations.hasOwnProperty(key)) {
                if (typeof console === 'object' && operations[operations] >= config.logLevel
                    (typeof console[key] === 'function' || typeof console[key] === 'object')) {
                    logger[key] = console[key];
                } else {
                    logger[key] = function () {};
                }
            }
        }

        return logger;
    }
);

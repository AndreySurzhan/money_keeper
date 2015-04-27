module.exports = function (router, CurrencyController, isAuthorized, sendError) {
    router.route('/currencies')
        .get(isAuthorized, function (req, res) {
            CurrencyController.getAll(
                req.user,
                function (err, currencies) {
                    if (err) {
                        sendError(err, res);

                        return;
                    }

                    res.json(currencies);
                }
            );
        })
        .post(isAuthorized, function (req, res) {
            CurrencyController.post(
                req.user,
                {
                    name: req.body.name
                },
                function (err, currency) {
                    if (err) {
                        sendError(err, res);

                        return;
                    }

                    res.json(currency);
                }
            );
        });

    router.route('/currencies/:currency_id')
        .get(isAuthorized, function (req, res) {
            CurrencyController.getById(
                req.user,
                req.params.currency_id,
                function (err, currency) {
                    if (err) {
                        sendError(err, res);

                        return;
                    }

                    res.json(currency);
                }
            );
        })
        .put(isAuthorized, function (req, res) {
            CurrencyController.update(
                req.user,
                req.params.currency_id,
                {
                    name: req.body.name
                },
                function (err, currency) {
                    if (err) {
                        sendError(err, res);

                        return;
                    }

                    res.json(currency);
                }
            );
        })
        .delete(isAuthorized, function (req, res) {
            CurrencyController.remove(
                req.user,
                req.params.currency_id,
                function (err, currency) {
                    if (err) {
                        sendError(err, res);

                        return;
                    }

                    res.json(currency);
                }
            );
        });
};

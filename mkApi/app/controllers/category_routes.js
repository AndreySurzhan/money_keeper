module.exports = function (router, CategoryController, isAuthorized) {
    router.route('/categories')
        .get(isAuthorized, function (req, res) {
            CategoryController.getAll(
                req.user,
                function (err, categories) {
                    if (err) {
                        sendError(err, res);

                        return;
                    }

                    res.json(categories);
                }
            );
        })
        .post(isAuthorized, function (req, res) {
            console.log('call route POST: /categories');
            CategoryController.post(
                req.user,
                {
                    name: req.body.name,
                    parent: req.body.parent,
                    income: req.body.income
                },
                function (err, category) {
                    if (err) {
                        sendError(err, res);

                        return;
                    }

                    res.json(category);
                }
            );
        });

    router.route('/categories/income')
        .get(isAuthorized, function (req, res) {
            CategoryController.getIncome(
                req.user,
                function (err, categories) {
                    if (err) {
                        sendError(err, res);

                        return;
                    }

                    res.json(categories);
                }
            );
        });

    router.route('/categories/outcome')
        .get(isAuthorized, function (req, res) {
            CategoryController.getOutcome(
                req.user,
                function (err, categories) {
                    if (err) {
                        sendError(err, res);

                        return;
                    }

                    res.json(categories);
                }
            );
        });

    router.route('/categories/:category_id')
        .get(isAuthorized, function (req, res) {
            CategoryController.getById(
                req.user,
                req.params.category_id,
                function (err, category) {
                    if (err) {
                        sendError(err, res);

                        return;
                    }

                    res.json(category);
                }
            );
        })
        .put(isAuthorized, function (req, res) {
            CategoryController.update(
                req.user,
                req.params.category_id,
                {
                    name: req.body.name,
                    parent: req.body.parent
                },
                function (err, category) {
                    if (err) {
                        sendError(err, res);

                        return;
                    }

                    res.json(category);
                }
            );
        })
        .delete(isAuthorized, function (req, res) {
            CategoryController.remove(
                req.user,
                req.params.category_id,
                function (err, category) {
                    if (err) {
                        sendError(err, res);

                        return;
                    }

                    res.json(category);
                }
            );
        });
};

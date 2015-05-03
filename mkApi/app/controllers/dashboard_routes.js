module.exports = function (router, DashboardController, isAuthorized, sendError) {
    router.route('/dashboard')
        .get(isAuthorized, function (req, res) {
            DashboardController.getData(
                req.user,
                function (err, dashboardData) {
                    if (err) {
                        sendError(err, res);

                        return;
                    }

                    res.json(dashboardData);
                }
            );
        })
};

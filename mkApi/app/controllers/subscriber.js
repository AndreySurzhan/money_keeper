var Subscriber = require('../models/subscriber');
var subscriberController = {
    add: function (email, callback) {
        Subscriber.findOne({
            email: email
        })
            .exec(function (err, subscriber) {
                if (err) {
                    callback(err);
                    return;
                }

                if (subscriber) {
                    callback(null, {
                        status: 200,
                        message: 'Already exists'
                    });
                    return;
                }

                subscriber = new Subscriber();
                subscriber.email = email;
                subscriber.date = new Date();

                subscriber.save(function (err) {
                    if (err) {
                        callback(err);
                        return;
                    }

                    callback(null, {
                        status: 201,
                        message: 'Created'
                    })
                });
            });
    }
};

module.exports = subscriberController;

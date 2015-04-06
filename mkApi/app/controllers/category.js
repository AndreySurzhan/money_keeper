var Category = require('../models/category');
var categoryRoutes = require('./category_routes');
var categoryController = {
    getAll: function (user, callback) {
        Category.find(
            {
                _owner: user._id
            })
            .populate('parent')
            .exec(callback);
    },
    getById: function (user, id, callback) {
        Category.findOne({
            _id: id,
            _owner: user._id
        })
            .populate('parent')
            .exec(callback);
    },
    getIncome: function (user, callback) {
        Category.find({
            _owner: user._id,
            income: true
        })
            .populate('parent')
            .exec(callback);
    },
    getOutcome: function (user, callback) {
        Category.find({
            _owner: user._id,
            income: false
        })
            .populate('parent')
            .exec(callback);
    },
    post: function (user, data, callback) {
        var category = new Category();

        category._owner = user._id;
        category.name = data.name;
        category.parent = data.parent;
        category.income = data.income;

        category.save(callback);
    },
    update: function (user, id, data, callback) {
        Category.findById(
            id,
            {
                _owner: user._id
            },
            function (err, category) {
                if (err) {
                    callback(err);

                    return;
                }

                category.name = data.name;
                category.parent = data.parent;
                category.save(callback);
            }
        );
    },
    remove: function (user, id, callback) {
        Category.remove(
            {
                _id: id,
                _owner: user._id
            },
            function (err, result) {
                if (err) {
                    callback(err);

                    return;
                }

                Category.find(
                    {
                        _owner: user._id
                    })
                    .populate('parent')
                    .exec(callback);
            }
        );
    },
    registerRoutes: function (router, isAuthorized) {
        categoryRoutes(router, this, isAuthorized);
    }
};

module.exports = categoryController;

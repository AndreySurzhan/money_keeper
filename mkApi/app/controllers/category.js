var Category = require('../models/category');
var CategoryController = function () {};

CategoryController.prototype.getAll = function (user, callback) {
    'use strict';

    Category.find(
        {
            _owner: user._id
        })
        .populate('parent')
        .exec(callback);
};

CategoryController.prototype.getById = function (user, id, callback) {
    'use strict';

    Category.findOne({
        _id: id,
        _owner: user._id
    })
        .populate('parent')
        .exec(callback);
};

CategoryController.prototype.getIncome = function (user, callback) {
    'use strict';

    Category.find({
        _owner: user._id,
        income: true
    })
        .populate('parent')
        .exec(callback);
};

CategoryController.prototype.getOutcome = function (user, callback) {
    'use strict';

    Category.find({
        _owner: user._id,
        income: false
    })
        .populate('parent')
        .exec(callback);
};

CategoryController.prototype.post = function (user, data, callback) {
    'use strict';

    var category = new Category();

    category._owner = user._id;
    category.name = data.name;
    category.parent = data.parent;
    category.income = data.income;

    category.save(callback);
};

CategoryController.prototype.update = function (user, id, data, callback) {
    'use strict';

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
};

CategoryController.prototype.remove = function (user, id, callback) {
    'use strict';

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
};

module.exports = new CategoryController();

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TransactionSchema = new Schema({
    _owner: 'String',
    date: 'Date',
    category: {
        type: 'ObjectId',
        ref: 'Category'
    },
    value: 'Number',
    account: {
        type: 'ObjectId',
        ref: 'Account'
    },
    note: 'String'
});

module.exports = mongoose.model('Transaction', TransactionSchema);

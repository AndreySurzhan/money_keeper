var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CurrencySchema = new Schema({
    _owner: 'String',
    name: 'String',
    icon: 'String',
    global: 'String'
});

module.exports = mongoose.model('Currency', CurrencySchema);

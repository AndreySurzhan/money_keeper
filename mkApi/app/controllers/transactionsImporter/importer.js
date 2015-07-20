var csv = require('fast-csv');
var fs = require('fs');
var Q = require('q');

var easyfinanceConfig = require('./import_easyfinance');

/**
 * Remove from string all not printable letters
 *
 * @param {string} str      - source string
 *
 * @returns {string} result - trimmed string
 */
var trimString = function (str) {
    var buf;
    var result = str;

    for (var i = result.length - 1; i >= 0; i--) {
        if (!charCodeIsPrintable(result.charCodeAt(i))) {
            buf = result.substring(0, i);
            buf += result.substring(i + 1);

            result = buf;
        }
    }

    return result;
    
    function charCodeIsPrintable(charCode) {
        var allowedChars = ' -=_+/-.,!"№%?*(){}:";' + "'";

        if (charCode >= '0'.charCodeAt(0) && charCode <= '9'.charCodeAt(0)) {
            return true;
        }

        if (charCode >= 'a'.charCodeAt(0) && charCode <= 'z'.charCodeAt(0)) {
            return true;
        }

        if (charCode >= 'A'.charCodeAt(0) && charCode <= 'Z'.charCodeAt(0)) {
            return true;
        }

        if (charCode >= 'а'.charCodeAt(0) && charCode <= 'я'.charCodeAt(0)) {
            return true;
        }

        if (charCode >= 'А'.charCodeAt(0) && charCode <= 'Я'.charCodeAt(0)) {
            return true;
        }

        for (var i = 0; i < allowedChars.length; i++) {
            if (charCode === allowedChars.charCodeAt(i)) {
                return true;
            }
        }

        return false;
    }
};

/**
 * Get table caption of current table with transactions
 *
 * @param {string} filePath     - path to *.csv file with importing transactions
 * @param {string} delimiter    - separator character to parse csv
 *
 * @returns {Q.Promise}         - should be resolved with array of column names
 */
var getTableCaption = function (filePath, delimiter) {
    var csvStream;
    var deferred = Q.defer();
    var firstString;
    var stream;

    stream = fs.createReadStream(filePath);
    csvStream = csv({
        delimiter: delimiter
    })
        .on("data", function (data) {
            firstString = firstString || data;
            //ToDo: close streams after reading first line
        })
        .on('end', function () {
            for (var i = 0; i < firstString.length; i++) {
                firstString[i] = trimString(firstString[i]);
            }

            deferred.resolve(firstString);
        });

    stream.pipe(csvStream);

    return deferred.promise;
};

/**
 * Get import map with column numbers of each transaction property
 *
 * @param {string[]} caption                        - array of column captions of current table to import
 * @param {Object[]} maps                           - pre-saved maps
 * @param {string[]} maps[].caption                 - caption of pre-saved map
 * @param {Object} maps[].fields                    - pre-saved map
 * @param {number} maps[].fields.date               - column number of date
 * @param {number} maps[].fields.category           - column number of category
 * @param {number} maps[].fields.value              - column number of value
 * @param {number} maps[].fields.type               - column number of type
 * @param {number} maps[].fields.accountSource      - column number of source account
 * @param {number} maps[].fields.accountDestination - column number of destination account
 * @param {number} maps[].fields.note               - column number of note
 *
 * @returns {Q.Promise}                             - should be resolved with 'fields' value of some map
 */
var getImportMap = function (caption, maps) {
    var deferred = Q.defer();
    var map;
    var result = null;

    for (var i = 0; i < maps.length; i++) {
        map = maps[i];

        if (captionsAreEqual(caption, map.caption)) {
            result = map.fields;
            break;
        }
    }

    if (result) {
        deferred.resolve(result);
    } else {
        deferred.reject('Import map was not found');
    }

    return deferred.promise;

    function captionsAreEqual(currentCaption, storedCaption) {
        console.log('comparing');
        console.log(currentCaption);
        console.log(storedCaption);

        if (currentCaption.length !== storedCaption.length) {
            console.log(currentCaption.length + ' != ' + storedCaption.length);
            return false;
        }

        for (var i = 0; i < currentCaption.length; i++) {
            if (currentCaption[i].localeCompare(storedCaption[i]) != 0) {
                console.log(stringToBytes(currentCaption[i]));
                console.log(stringToBytes(storedCaption[i]));
                return false;
            }
        }

        return true;
    }

    function stringToBytes (str) {
        var bytes = [];

        for (var i = 0; i < str.length; ++i) {
            bytes.push(str.charCodeAt(i));
        }

        return bytes
    }
};

/**
 * Get lists of categories and accounts names used in transactions
 *
 * @param {string} filePath                     - path to *.csv file with importing transactions
 * @param {string} delimiter                    - separator character to parse csv
 * @param {Object} importMap                    - object with map to parse transaction
 * @param {number} importMap.accountSource      - column number of source account
 * @param {number} importMap.accountDestination - column number of destination account
 * @param {number} importMap.category           - column number of transaction category
 * @param {number} importMap.type               - column number of transaction type
 * @param {Function} getTransactionType         - transaction type parser.
 *                                              should return 'income' or 'outcome' or 'transfer' or null
 *
 * @returns {Q.Promise}                         - should be resolved with:
 *                                              {
 *                                                  accounts: string[],
 *                                                  categories: string[]
 *                                              }
 */
var getMappingData = function (filePath, delimiter, importMap, getTransactionType) {
    var csvStream;
    var deferred = Q.defer();
    var isFirstString = true;
    var resultAccounts = {};
    var resultCategories = {};
    var stream;

    stream = fs.createReadStream(filePath);
    csvStream = csv({
        delimiter: delimiter
    })
        .on("data", function (data) {
            var accountSource;
            var accountDestination;
            var category;
            var transactionType;

            // skip first string
            if (isFirstString) {
                isFirstString = false;
                return;
            }

            accountSource = data[importMap.accountSource];
            accountDestination = data[importMap.accountDestination];
            category = data[importMap.category];
            transactionType = getTransactionType(data[importMap.type]);

            if (!transactionType || !accountSource || !(accountDestination || category)) {
                return;
            }

            resultAccounts[accountSource] = true;

            if (transactionType === 'transfer') {
                resultAccounts[accountDestination] = true;
            } else {
                resultCategories[category] = true;
            }
        })
        .on('end', function () {
            console.log('- on end');

            var result = {
                accounts: [],
                categories: []
            };

            for (var account in resultAccounts) {
                if (resultAccounts.hasOwnProperty(account)) {
                    result.accounts.push(account);
                }
            }

            for (var category in resultCategories) {
                if (resultCategories.hasOwnProperty(category)) {
                    result.categories.push(category);
                }
            }

            deferred.resolve(result);
        });

    stream.pipe(csvStream);

    return deferred.promise;
};

/**
 * Importer instance
 *
 * @param {string} source - name of third part finance system:
 *                          'easyfinance'
 * @param {string} fileName - path to *.csv file with importing transactions
 * @constructor
 */
var Importer = function (source, fileName) {
    this.fileName = fileName;   // path to *.csv
    this.importMap = null;      // import map
    this.config = null;         // transactions import config

    switch (source) {
        case 'easyfinance':
            this.config = easyfinanceConfig;
            break;
        default:
            throw new Error('Unknown transactions import source "' + source + '"');
    }
};

/**
 * Get mapping data - lists of accounts and categories used in all transactions
 *
 * @param {function} success    - success callback. In case of success should be called with:
 *                              {
 *                                  accounts: string[],
 *                                  categories: string[]
 *                              }
 * @param {function} error      - error callback. In case of error should be called with exception object
 *
 * @return {void}
 */
Importer.prototype.getMappingData = function (success, error) {
    var that = this;

    success = typeof success === 'function' ? success : function () {};
    error = typeof error === 'function' ? error : function () {};

    Q
        .fcall(function () {
            return getTableCaption(that.fileName, that.config.delimiter);
        })
        .then(function (caption) {
            return getImportMap(caption, that.config.maps);
        })
        .then(function (importMap) {
            that.importMap = importMap;

            return getMappingData(that.fileName, that.config.delimiter, that.importMap, that.config.getTransactionType);
        })
        .then(function (mappingData) {
            success(mappingData);
        })
        .catch(function (error) {
            error(error);
        });
};

Importer.prototype.importTransactions = function () {
    //ToDo
};

module.exports = Importer;
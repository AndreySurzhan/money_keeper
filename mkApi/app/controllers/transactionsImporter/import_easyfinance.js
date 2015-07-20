module.exports = {
    delimiter: ';',
    getTransactionType: function (type) {
        var result = null;

        switch (type) {
            case 'доход':
                result = 'income';
                break;
            case 'расход':
                result = 'outcome';
                break;
            case 'перевод со счёта':
                result = 'transfer';
                break;
        }

        return result;
    },
    maps: [
        {
            caption: [
                'дата',
                'счет откуда',
                'счет куда',
                'тип операции',
                'сумма в валюте по умолчанию',
                'валюта по умолчанию',
                'сумма в валюте счета откуда',
                'валюта счета откуда',
                'курс обмена',
                'сумма в валюте счета куда',
                'валюта счета куда',
                'комментарий',
                'тэг',
                'категория',
                'системная категория'
            ],
            fields: {
                date: 0,
                category: 13,
                value: 6,
                type: 3,
                accountSource: 1,
                accountDestination: 2,
                note: 11
            }
        }
    ]
};

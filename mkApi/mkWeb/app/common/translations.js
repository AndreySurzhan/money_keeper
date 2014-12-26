define(
    [
        'angular',
        'json!config',
        'json!common/translations/en.json',
        'json!common/translations/ru.json',
        'angular-translate'
    ],
    function (ng, config, en, ru) {
        'use strict';

        var moneyKeeperTranslations = ng.module(
            'moneyKeeperTranslations',
            [
                'pascalprecht.translate'
            ]
        );

        moneyKeeperTranslations.config(
            [
                '$translateProvider',
                function ($translateProvider) {
                    $translateProvider.translations('en', en);
                    $translateProvider.translations('ru', ru);

                    $translateProvider.preferredLanguage(config.lang);
                }
            ]
        );

        return moneyKeeperTranslations;
    }
);

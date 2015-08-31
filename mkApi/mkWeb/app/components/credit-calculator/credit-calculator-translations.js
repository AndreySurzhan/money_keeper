define(
    [
        'mkTranslations',
        'json!./en.json',
        'json!./ru.json'
    ],
    function (mkTranslations, en, ru) {
        mkTranslations.config(
            [
                '$translateProvider',
                function ($translateProvider) {
                    $translateProvider.translations('en', en);
                    $translateProvider.translations('ru', ru);
                }
            ]
        );
        return;
    }
);

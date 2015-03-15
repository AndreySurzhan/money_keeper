requirejs.config(
    {
        paths: {
            'text': '../libs/requirejs/text',
            'json': '../libs/requirejs/json',
            'domReady': '../libs/requirejs/domReady',

            'angular': '../libs/angular/angular',
            'angular-animate': '../libs/angular/angular-animate',
            'angular-resource': '../libs/angular/angular-resource',
            'angular-route': '../libs/angular/angular-route',
            'angular-translate': '../libs/angular/angular-translate',
            'angular-moment': '../libs/angular/angular-moment',
            'angular-moment-ru': '../libs/angular/angular-moment-locales/ru',
            'angular-moment-en': '../libs/angular/angular-moment-locales/en-gb',

            'jquery': '../libs/jquery/jquery',
            'moment': '../libs/moment/moment',
            'underscore': '../libs/underscore/underscore',

            'app': 'app',
            'config': '../config.json',
            'logger': 'common/logger',
            'mkControllers': 'common/controllers',
            'mkTranslations': 'common/translations',
            'mkServices': 'common/services',
            'mkFilters': 'common/filters',

            'enums': 'common/enums.json'
        },
        shim: {
            'angular': {
                exports: 'angular'
            },
            'angular-route': {
                deps: ['angular']
            },
            'angular-moment' : {
                deps: ['angular-moment-ru', 'angular-moment-en']
            }
        },
        deps: ['bootstrap']
    }
);

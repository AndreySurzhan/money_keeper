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

            'app': 'app',
            'config': '../config.json',
            'mkControllers': 'common/controllers',
            'mkTranslations': 'common/translations',
            'mkServices': 'common/services',
            'mkFilters': 'common/filters'
        },
        shim: {
            'angular': {
                exports: 'angular'
            },
            'angular-route': {
                deps: ['angular']
            }
        },
        deps: ['bootstrap']
    }
);

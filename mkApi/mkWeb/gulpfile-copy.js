// Libs
var path = require('./gulpfile-path');

// Local variables
var vendorDir = path.vendor.src;
var destDir = path.vendor.dist;

module.exports = [
    // AngularJS
    {
        from: vendorDir + 'angular-bootstrap/ui-bootstrap-tpls.js',
        to: destDir + 'angular/'
    },
    {
        from: vendorDir + 'angular/angular.js',
        to: destDir + 'angular/'
    },
    {
        from: vendorDir + 'angular-resource/angular-resource.js',
        to: destDir + 'angular/'
    },
    {
        from: vendorDir + 'angular-animate/angular-animate.js',
        to: destDir + 'angular/'
    },
    {
        from: vendorDir + 'angular-route/angular-route.js',
        to: destDir + 'angular/'
    },
    {
        from: vendorDir + 'angular-translate/angular-translate.js',
        to: destDir + 'angular/'
    },
    {
        from: vendorDir + 'angular-moment/angular-moment.js',
        to: destDir + 'angular/'
    },
    {
        from: vendorDir + 'moment/locale/ru.js',
        to: destDir + 'angular/angular-moment-locales/'
    },
    {
        from: vendorDir + 'moment/locale/en-gb.js',
        to: destDir + 'angular/angular-moment-locales/'
    },
    // jQuery
    {
        from: vendorDir + 'jquery/dist/jquery.js',
        to: destDir + 'jquery/'
    },
    // RequireJS
    {
        from: vendorDir + 'requirejs/require.js',
        to: destDir + 'requirejs/'
    },
    {
        from: vendorDir + 'requirejs-domready/domReady.js',
        to: destDir + 'requirejs/'
    },
    {
        from: vendorDir + 'requirejs-plugins/src/json.js',
        to: destDir + 'requirejs/'
    },
    {
        from: vendorDir + 'requirejs-plugins/lib/text.js',
        to: destDir + 'requirejs/'
    },
    // Other
    {
        from: vendorDir + 'velocity/velocity.js',
        to: destDir + 'velocity/'
    },
    {
        from: vendorDir + 'moment/moment.js',
        to: destDir + 'moment/'
    },
    {
        from: vendorDir + 'underscore/underscore.js',
        to: destDir + 'underscore/'
    },
    {
        from: vendorDir + 'datedropper/datedropper.js',
        to: destDir + 'datedropper/'
    },
    {
        from: vendorDir + 'datedropper/datedropper.css',
        to: destDir + '../styles/datedropper/'
    },
    {
        from: vendorDir + 'datedropper/icons/*',
        to: destDir + '../styles/datedropper/icons/'
    },
    // Styles
    {
        from: vendorDir + 'bootstrap/dist/**/*.*',
        to: destDir + '../styles/framework/bootstrap/'
    },
    {
        from: vendorDir + 'bootstrap/dist/css/bootstrap.css.map',
        to: destDir + '../styles/'
    },
    {
        from: vendorDir + 'font-awesome/css/*',
        to: destDir + '../styles/framework/font-awesome/css/'
    },
    {
        from: vendorDir + 'font-awesome/fonts/*',
        to: destDir + '../fonts/'
    }
];

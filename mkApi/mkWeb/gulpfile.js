var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var bower = require('gulp-bower');
var del = require('del');
var runSequence = require('run-sequence');

gulp.task('less', function () {
    gulp.src('./styles/*.less')
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(gulp.dest('./styles'));
});

/* --- Install vendor libraries ---*/

var vendorDir = 'bower-components/';
var destDir = 'libs/';
var copyFilesList = [
    // AngularJS
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

gulp.task('bower-install', function (callback) {
    return bower()
        .pipe(gulp.dest('bower-components/'));
});

gulp.task('copy', function (callback) {
    var stream;

    for (var i = 0; i < copyFilesList.length; i++) {
        stream = gulp.src(copyFilesList[i].from)
            .pipe(gulp.dest(copyFilesList[i].to));
    }

    return stream;
});

gulp.task('clean-bower', function (callback) {
    return del(vendorDir, callback);
});

gulp.task('vendor', function (callback) {
    runSequence(
        'bower-install',
        'copy',
        'clean-bower',
        callback
    );
});

/* --- Global tasks ---*/

gulp.task('default', function (callback) {
    runSequence(
        'vendor',
        'less',
        callback
    );
});
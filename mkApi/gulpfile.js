var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var bower = require('gulp-bower');
var del = require('del');
var runSequence = require('run-sequence');

var vendorDir = './bower-components/';
var destDir = './static/vendor/';
var copyFilesList = [
    {
        from: vendorDir + 'font-awesome/css/*',
        to: destDir + 'font-awesome/css/'
    },
    {
        from: vendorDir + 'font-awesome/fonts/*',
        to: destDir + 'font-awesome/fonts/'
    }
];

gulp.task('less', function () {
    gulp.src('./static/styles/*.less')
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(gulp.dest('./static/styles/built'));
});

gulp.task('bower-install', function (callback) {
    return bower()
        .pipe(gulp.dest('bower-components/'));
});

gulp.task('clean-bower', function (callback) {
    return del(vendorDir, callback);
});

gulp.task('copy', function (callback) {
    var stream;

    for (var i = 0; i < copyFilesList.length; i++) {
        stream = gulp.src(copyFilesList[i].from)
            .pipe(gulp.dest(copyFilesList[i].to));
    }

    return stream;
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

    gulp.watch('./static/styles/**', function (event) {
        gulp.run('less');
    });
});

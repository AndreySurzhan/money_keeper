// Libs

var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var bower = require('gulp-bower');
var runSequence = require('run-sequence');
var watch = require('gulp-watch');
var prefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var cssmin = require('gulp-minify-css');
var rimraf = require('rimraf');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var gutil = require('gulp-util');

// Local variables

var buildPath = require('./gulpfile-path');
var copyFilesList = require('./gulpfile-copy');

// Subtasks

gulp.task('style:build', function () {
    gutil.log('from', buildPath.styles.src);
    gutil.log('to', buildPath.styles.dist);

    gulp.src(buildPath.styles.src)
        .pipe(less({paths: [ path.join(__dirname, 'less', 'includes') ]}))
        //.pipe(prefixer('last 2 versions'))
        .pipe(cssmin())
        .pipe(gulp.dest(buildPath.styles.dist));
});

gulp.task('style:dev', function () {
    gutil.log('from', buildPath.styles.src);
    gutil.log('to', buildPath.styles.dist);

    gulp.src(buildPath.styles.src)
        .pipe(sourcemaps.init())
        .pipe(less({paths: [ path.join(__dirname, 'less', 'includes') ]}))
        //.pipe(prefixer('last 2 versions'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(buildPath.styles.dist));
});

gulp.task('image:build', function () {
    gulp.src(buildPath.images.src)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(buildPath.images.dist));
});

gulp.task('watch', function(){
    watch([buildPath.styles.watch], function(event, cb) {
        gulp.start('style:dev');
    });
    watch([buildPath.images.watch], function(event, cb) {
        gulp.start('image:build');
    });
});

gulp.task('bower-install', function (callback) {
    return bower()
        .pipe(gulp.dest('bower-components/'));
});

gulp.task('bower-copy', function (callback) {
    var stream;

    for (var i = 0; i < copyFilesList.length; i++) {
        stream = gulp.src(copyFilesList[i].from)
            .pipe(gulp.dest(copyFilesList[i].to));
    }

    return stream;
});

gulp.task('bower-clean', function (callback) {
    rimraf(buildPath.vendor.src, callback);
});

gulp.task('vendor', function (callback) {
    runSequence(
        'bower-install',
        'bower-copy',
        'bower-clean',
        callback
    );
});

// Global tasks

gulp.task('dev', function (callback) {
    runSequence(
        'vendor',
        ['image:build', 'style:dev'],
        'watch',
        callback
    );
});

gulp.task('build', function (callback) {
    runSequence(
        'vendor',
        ['image:build', 'style:build'],
        callback
    );
});

gulp.task('default', ['dev']);

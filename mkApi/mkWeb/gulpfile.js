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
var merge = require('merge-stream');
var shell = require('gulp-shell');
var rename = require('gulp-rename');

// Local variables

var buildPath = require('./gulpfile-path');
var copyFilesList = require('./gulpfile-copy');

// Subtasks

gulp.task('scripts:build', shell.task([
    'r.js -o baseUrl=<%= baseUrl %> mainConfigFile=<%= config %> name=<%= src %> out=<%= dist %>'
], {
    templateData: buildPath.scripts.build
}));

gulp.task('scripts:dev', function () {
    gulp.src(buildPath.scripts.dev.src)
        .pipe(rename(buildPath.scripts.dev.dist))
        .pipe(gulp.dest(buildPath.scripts.dev.distFolder));
});

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

gulp.task('bower-install', function (callback) {
    return bower()
        .pipe(gulp.dest('bower-components/'));
});

gulp.task('bower-copy', function (callback) {
    var streams = [];

    for (var i = 0; i < copyFilesList.length; i++) {
        streams.push(
            gulp.src(copyFilesList[i].from).pipe(gulp.dest(copyFilesList[i].to))
        );
    }

    return merge.apply(merge, streams);
});

gulp.task('bower-clean', function (callback) {
    var path = buildPath.vendor.src;

    gutil.log('rimraf: ', path);

    rimraf(path, callback);
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

gulp.task('watch', function(){
    watch([buildPath.styles.watch], function(event, cb) {
        gulp.start('style:dev');
    });
    watch([buildPath.images.watch], function(event, cb) {
        gulp.start('image:build');
    });
});

gulp.task('dev', function (callback) {
    runSequence(
        'vendor',
        'image:build',
        ['style:dev', 'scripts:dev'],
        callback
    );
});

gulp.task('build', function (callback) {
    runSequence(
        'vendor',
        'image:build',
        ['style:build', 'scripts:build'],
        callback
    );
});

gulp.task('default', ['build']);

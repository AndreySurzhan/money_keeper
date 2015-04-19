var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var runSequence = require('run-sequence');

gulp.task('less', function () {
    gulp.src('./static/styles/*.less')
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(gulp.dest('./static/styles/built'));
});

/* --- Global tasks ---*/

gulp.task('default', function (callback) {
    runSequence(
        'less',
        callback
    );
});
